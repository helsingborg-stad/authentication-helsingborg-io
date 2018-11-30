const router = require('express').Router();
const dalNavet = require('./dalNavet');
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
router.get('/test', (req, res) => {
    try {
        console.log('this is test')
        return res.json('hello');
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;
