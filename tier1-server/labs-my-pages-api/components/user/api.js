const router = require('express').Router();
const dal = require('./dal');
const authSchemas = require('./validationSchemas/index');

const schemaValidator = require('../middlewares/schemaValidator');
const validateRequest = schemaValidator(true, authSchemas);

router.get('/:id', validateRequest, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await dal.getUser(id);

        return res.json(
            {
                user: {
                    personalNumber: user[0].PersonalNumber,
                    name: user[0].Name + ' ' + user[0].SurName,
                    givenName: user[0].Name,
                    surName: user[0].SurName
                }
            }
        );
    } catch (err) {
        res.json(err);
    }
});
module.exports = router;
