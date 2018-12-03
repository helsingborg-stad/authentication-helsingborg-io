const express = require('express');
const router = express.Router();

router.use('/getBygglov', require('./bygglov/api'));

module.exports = router;
