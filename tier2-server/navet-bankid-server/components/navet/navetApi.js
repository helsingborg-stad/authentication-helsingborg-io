const router = require('express').Router();
const dalNavet = require('./dalNavet');
const navetModel = require('./navetModel');

/*
not yet implemented in boiler
const SchemaValidator = require('../middlewares/schemaValidators');
const validateRequest = SchemaValidator(true);
*/

// changed to get temp, it was post
router.get('/', /* validateRequest, */ async (req, res) => {
    try {
        return res.json(await dalNavet.getPerson(req.body));
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});

module.exports = router;
