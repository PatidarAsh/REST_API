const {
    validateJSONSchema
} = require("../validations/jsonSchema.validation");

const isValidJSONSchema = async (json, schema) => {
    return await validateJSONSchema(json, schema);
}

module.exports = {
    isValidJSONSchema
}