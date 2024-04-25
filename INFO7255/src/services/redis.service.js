const redis = require('redis');
const config = require("../../config/local.json");

/**
 *  Create Redis client
 *  Reference: https://www.npmjs.com/package/redis
 */
const client = redis.createClient(config.DB_PORT, config.DB_HOST);

// Redis event listener - CONNECT
client.on('connect', () => {
    console.log('Redis Client Connected!');
});

// Redis event listener - ERROR
client.on('error', (err) => {
    console.log('Redis Client Error', err)
});

// Connect to Redis Client
client.connect();

const ifKeyExists = async (key) => {
    const data = await client.exists(key);
    return !!data;
}

const getETag = async (key) => {
    return await client.hGet(key, "eTag");
}

const getKeyType = async (key) => {
    return await client.type(key);
}

const setETag = async (key, eTag) => {
    return await client.hSet(key, "eTag", eTag);
}

const addSetValue = async (key, value) => {
    return await client.sAdd(key, value);
}

const hSet = async (key, field, value) => {
    return await client.hSet(key, field, value);
}

const getKeys = async (pattern) => {
    return await client.keys(pattern);
}

const deleteKeys = async (keys) => {
    return await client.del(keys);
}

const getAllValuesByKey = async (key) => {
    return await client.hGetAll(key);
}

const sMembers = async (key) => {
    return await client.sMembers(key);
}

module.exports = {
    ifKeyExists,
    getETag,
    getKeyType,
    setETag,
    addSetValue,
    hSet,
    getKeys,
    deleteKeys,
    getAllValuesByKey,
    sMembers
}