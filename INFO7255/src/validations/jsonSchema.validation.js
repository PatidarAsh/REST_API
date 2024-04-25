const ajv = require('ajv');

const ajvClient = new ajv({
    allErrors: true,
    async: true,
    strict: false
});

const validateJSONSchema = async (json, schema) => {
    const validate = ajvClient.compile(schema);
    const valid = await validate(json);
    if (!valid) {
        const errors = await parseErrors(validate.errors);
        return {
            error: true,
            data: errors
        }
    }
    return {
        error: false
    }
}

const parseErrors = async (validationErrors) => {
    let errors = [];
    validationErrors.forEach(error => {
        errors.push(error);
    });

    return errors;
}

module.exports = {
    validateJSONSchema
}