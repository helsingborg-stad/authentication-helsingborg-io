const router = require('express').Router();
const dal = require('./dal');
const schema = require('./validation/authSchema');
const ExpressJoi = require('express-joi-validator');

router.post('/', ExpressJoi(schema), async (req, res) => {
    try {
        return res.json(
            await dal.authenticate(req.body)
        );
    } catch (err) {
        res.json(err);
    }
});

// just test route
router.post('/test', (req, res) => {
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
