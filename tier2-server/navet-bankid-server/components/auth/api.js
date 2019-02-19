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

module.exports = router;
