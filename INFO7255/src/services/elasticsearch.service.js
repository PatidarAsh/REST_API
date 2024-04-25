const client = require('../services/elasticsearch.connection');
const config = require("../../config/local.json");

const INDEX_NAME = config.ELASTICSEARCH_INDEX_NAME;

// Reference: https://www.compose.com/articles/getting-started-with-elasticsearch-and-node/

client.ping((error) => {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    }
    console.log('Elastic search client is working fine!');
});

let MapOfDocuments = {};
let listOfKeys = [];

const convertMapToDocumentIndex = async (jsonObject, parentId, objectName, parentObjId) => {
    const valueMap = {};
    const map = {};

    for (const [key, value] of Object.entries(jsonObject)) {
        const redisKey = `${jsonObject.objectType}:${parentId}`;
        if (Array.isArray(value)) {
            await convertToList(value, jsonObject.objectId, key, parentObjId);
        } else if (typeof value === 'object') {
            await convertMapToDocumentIndex(value, jsonObject.objectId, key, parentObjId);
        } else {
            valueMap[key] = value;
            map[redisKey] = valueMap
        }
    }

    if (objectName === "plan") {
        valueMap["plan_join"] = {
            "parent": "",
            "name": objectName
        }
    } else if (objectName.match(/^-?\d+$/)) {
        parentId = parentObjId;
        valueMap["plan_join"] = {
            "parent": parentObjId,
            "name": "linkedPlanServices"
        };
    } else {
        valueMap["plan_join"] = {
            "name": objectName,
            "parent": parentId
        }
    }

    const id = `${parentId}:${jsonObject.objectId}`;
    if (!!jsonObject?.objectId) MapOfDocuments[id] = valueMap;
    return map;
}

const convertToList = async (jsonArray, parentId, objectName, parentObjId) => {
    const list = [];
    for (let i = 0; i < jsonArray.length; i++) {
        let value = jsonArray[i];
        if (Array.isArray(value)) {
            value = await convertToList(value, parentId, objectName, parentObjId);
        } else if (typeof value === 'object') {
            value = await convertMapToDocumentIndex(value, parentId, objectName);
        }
        list.push(value);
    }
    return list;
}

const convertToKeysList = async (jsonArray) => {
    let list = [];
    for (let value of jsonArray) {
        if (Array.isArray(value)) {
            value = await convertToKeysList(value);
        } else if (typeof value === 'object') {
            value = await convertToKeys(value);
        }
        list.push(value);
    }
    return list;
}

const convertToKeys = async (jsonObject) => {
    const map = {};
    const valueMap = {};

    for (const [key, value] of Object.entries(jsonObject)) {
        const redisKey = jsonObject["objectId"];
        if (Array.isArray(value)) {
            await convertToKeysList(value);
        } else if (typeof value === 'object') {
            await convertToKeys(value);
        } else {
            valueMap[key] = value;
            map[redisKey] = valueMap;
        }
    }

    listOfKeys.push(jsonObject["objectId"]);
    return map;

}

const postDocument = async (plan) => {
    try {
        MapOfDocuments = {};
        await convertMapToDocumentIndex(plan, "", "plan", plan.objectId);
        for (const [key, value] of Object.entries(MapOfDocuments)) {
            const [parentId, objectId] = key.split(":");
            await client.index({
                index: INDEX_NAME,
                id: objectId,
                routing: parentId,
                body: value,
            });
        }
        console.log('Documents have been successfully indexed!');
    } catch (e) {
        console.log('Error indexing documents:', error);
    }
}

const deleteDocument = async (jsonObject) => {
    listOfKeys = [];
    await convertToKeys(jsonObject);
    console.log(listOfKeys);
    for (const key of listOfKeys) {
        client.delete({
            index: INDEX_NAME,
            id: key,
        }, (err, res) => {
            if (err) {
                console.error("Error:",err.message);
            } else {
                console.log('Indexes have been deleted!', res);
            }
        });
    }
}



module.exports = {
    postDocument,
    deleteDocument
}