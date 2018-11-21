const express = require('express');
const router = express.Router();

router.use('/getPerson', require('./person/personApi'));

module.exports = router;
