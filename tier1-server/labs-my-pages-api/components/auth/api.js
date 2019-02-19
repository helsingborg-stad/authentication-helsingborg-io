const jwt = require('jsonwebtoken');
const router = require('express').Router();
const dal = require('./dal');
const authSchemas = require('./validationSchemas/index');

const schemaValidator = require('../middlewares/schemaValidator');
const validateRequest = schemaValidator(true, authSchemas);

router.post('/', async (req, res) => {
    try {
        console.log('reqbody', req.body);

        const { pno, endUserIp } = req.body;

        console.log('pno', pno);
        console.log('eui', endUserIp);

        const user = await dal.authenticate(pno, endUserIp);
        console.log('user', user);
        if (user && pno === user.personalNumber) {
            let token = jwt.sign({ pno: user.personalNumber }, process.env.AUTHSECRET, { expiresIn: '24h' }); // Signing the token
            res.json({
                sucess: true,
                err: null,
                token,
                user: user
            });
        } else {
            console.log('auth failed');
            res.status(401).json({
                sucess: false,
                token: null,
                err: 'auth failed',
                user: null
            });
        }
    } catch (err) {
        res.json(err);
    }
});

router.get('/user/:id', validateRequest, async (_req, res) => {
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
