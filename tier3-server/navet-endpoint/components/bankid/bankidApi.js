const router = require('express').Router();
const bankid = require('./dalBankid');

router.post('/auth', async (req, res) => {
    try {
        const { endUserIp } = req.body;

        return res.json(
            await bankid.auth(endUserIp)
        );
    } catch (err) {
        console.log('err', err);
        res.json(err);
    }
});

router.post('/sign', async (req, res) => {
    try {
        const { endUserIp, personalNumber, userVisibleData } = req.body;

        return res.json(
            await bankid.sign(endUserIp, personalNumber, userVisibleData)
        );
    } catch (err) {
        console.log('err', err);
        res.json(err);
    }
});

router.post('/collect', async (req, res) => {
    try {
        const { orderRef } = req.body;

        return res.json(
            await bankid.collect(orderRef)
        );
    } catch (err) {
        console.log('err', err);
        res.json(err);
    }
});

module.exports = router;
