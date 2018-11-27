const router = require('express').Router();
const dalNavet = require('./dalNavet');
const navetModel = require('./navetModel');
const navetSchema = require('./navetSchema');
const ExpressJoi = require('express-joi-validator');

router.get('/', ExpressJoi(navetSchema), async (req, res) => {
    try {
        return res.json(await dalNavet.getPerson(req.body));
    } catch (err) {
        res.json(err);
    }
});
// just test route
router.post('/test', (req, res) => {

    console.log(req.body);
    try {
        console.log('this is test +++++++++++++++++++++++++++++++++');
        console.log(req.body);
        console.log(req.headers)
        return res.json('hello');
    } catch (err) {
        console.log('3001 error')
        res.json(err);xcxc
    }
});

module.exports = router;
