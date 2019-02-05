const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth/api'));
router.use('/user', require('./user/api'));
router.use('/form', require('./form/api'));
router.use('/payment', require('./payment/api'));

module.exports = router;
