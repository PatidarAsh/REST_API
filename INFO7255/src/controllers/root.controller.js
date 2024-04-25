const status = require('http-status');
const {
    createToken
} = require("../services/jwt.service");

const getToken = async (req, res) => {
    const token = await createToken();
    return res.send({
        token,
        createdAt: new Date(),
        status: 200
    }).status(status.CREATED);
}

const validateToken = async (_, res) => {
    return res.status(status.OK).send({
        error: false,
        status: 200,
        data: {
            verified: true
        }
    });
}

module.exports = {
    getToken,
    validateToken
}