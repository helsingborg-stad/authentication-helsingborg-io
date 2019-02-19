const router = require('express').Router();
const dal = require('./dal');
const authSchemas = require('./validationSchemas/index');

const schemaValidator = require('../middlewares/schemaValidator');
const validateRequest = schemaValidator(true, authSchemas);

router.post('/', validateRequest, async (req, res) => {
    try {
        const { inputData } = req.body;

        const name = inputData.find(x => x.key === 'name').value;
        const personalNumber = inputData.find(x => x.key === 'personalNumber').value;
        const address = inputData.find(x => x.key === 'address').value;
        const zipCode = inputData.find(x => x.key === 'zipCode').value;
        const city = inputData.find(x => x.key === 'city').value;

        const formRow = {
            Name: name,
            PersonalNumber: personalNumber,
            Address: address,
            ZipCode: zipCode,
            City: city,
            Status: 0
        };

        return res.json(
            await dal.saveForm(formRow)
        );
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;
