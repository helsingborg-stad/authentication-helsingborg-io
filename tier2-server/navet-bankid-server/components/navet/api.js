const router = require('express').Router();
const dal = require('./dal');
const schema = require('./schema');
const ExpressJoi = require('express-joi-validator');

router.post('/', ExpressJoi(schema), async (req, res) => {
    try {
        return res.json(await dal.getPerson(req.body));
    } catch (err) {
        res.json(err);
    }
});
// just test route
router.post('/test', (req, res) => {
    try {
        console.log('this is test');
        return res.json('hello');
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;
