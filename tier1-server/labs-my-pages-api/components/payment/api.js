const jwt = require('jsonwebtoken');
const router = require('express').Router();
const dal = require('./dal');
const authSchemas = require('./validationSchemas/index');

const schemaValidator = require('../middlewares/schemaValidator');
const validateRequest = schemaValidator(true, authSchemas);

router.get('/:id', validateRequest, async (_req, res) => {
    try {
        return res.json(
            {
                'user': {
                    'name': 'Tom Andreasson',
                    'givenName': 'Tom',
                    'surname': 'Andreasson',
                    'personalNumber': '198404293279',
                    'address': 'Drottninggatan 1',
                    'zipCode': 11120,
                    'city': 'Stockholm'
                }
            }
        );
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;
