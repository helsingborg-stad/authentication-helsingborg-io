const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth/api'));

module.exports = router;
