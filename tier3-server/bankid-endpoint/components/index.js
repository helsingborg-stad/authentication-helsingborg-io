const express = require('express');
const router = express.Router();

router.use('/bankid', require('./bankid/api'));

module.exports = router;
