const status = require('http-status');
// const {
//     isValidateToken
// } = require('../services/jwt.service');

// module.exports = async (req, res, next) => {
//     try {
//         let token = req.headers["authorization"];
//         console.log(token);
//         if (!token) return res.status(403).send("Access denied.");
//         token = token.split(' ')[1];
//         const isValid = await isValidateToken(token);
//         if (!isValid) res.send({
//             error: "Token not valid!"
//         }).status(status.UNAUTHORIZED);
//         next();
//     } catch (error) {
//         res.status(status.UNAUTHORIZED).send("Invalid token");
//     }
// };



const { OAuth2Client } = require('google-auth-library');

const  CLIENT_ID  = process.env.CLIENT_ID;
const gClient = new OAuth2Client(CLIENT_ID);

const auth = async (req, res, next) => {
  try {
    if (req.headers.authorization === null) {
      return res.status(401).send('Unauthorized');
    }
    const token = req.headers['authorization'].split(' ')[1]; // extract bearer token
    const ticket = await gClient.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
   // logger.info(`Authenticated User`, { email: payload.email });
    next();
  } catch (err) {
   // logger.error(`Validation error ${err}`);
    return res.status(401).send('Unauthorized');
  }
};

module.exports = auth;
