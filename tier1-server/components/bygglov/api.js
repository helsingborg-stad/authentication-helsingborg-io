const router = require('express').Router();
const dal = require('./dal');
const inputSchema = require('./inputSchema');
const ExpressJoi = require('express-joi-validator');

router.get('/', ExpressJoi(inputSchema), async (req, res) => {
    try {
        return res.json(await dal.getBygglov(req.body));
    } catch (err) {
        res.json(err);
    }
});
// just test route
router.get('/test', (req, res) => {
    try {
        console.log('this is test');
        return res.json('hello');
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;
