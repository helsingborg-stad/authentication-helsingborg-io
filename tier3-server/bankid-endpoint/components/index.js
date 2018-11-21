const express = require('express');
const router = express.Router();

router.use('/bankid', require('./bankid/bankIdApi'));

module.exports = router;
