const router = require('express').Router();
const dalPerson = require('./dal');

router.post('/', async (req, res) => {
    try {
        res.set({ 'Content-Type': 'application/json' });

        return res.send(
            await dalPerson.getPerson(req.body)
        );
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;
