const express = require('express');
const {
    rootController
} = require('../controllers');
const auth = require('../middlewares/auth');

const router = express.Router();

router
    .route('/token')
    .get(rootController.getToken);

router
    .route('/validate')
    .post(auth, rootController.validateToken);

module.exports = router;