const router = require('express').Router();
const dal = require('./dal');
const schema = require('./validation/authSchema');
const ExpressJoi = require('express-joi-validator');
const jwt = require('jsonwebtoken');

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
        const { personalNumber } = req.body;
        // Issue token
        const payload = { personalNumber };
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '1h'
        });
        res.cookie('token', token, { httpOnly: true });

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
