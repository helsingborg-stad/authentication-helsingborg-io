const router = require('express').Router();
const dalPerson = require('./dalPerson');
const Player = require('./personModel');

/*
not yet implemented in boiler
const SchemaValidator = require('../middlewares/schemaValidators');
const validateRequest = SchemaValidator(true);
*/
// changed to get temp, it was post
router.get('/', /* validateRequest, */ async (req, res) => {
    try {
        return res.json(await dalPerson.getPerson(req.body));
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});

module.exports = router;
