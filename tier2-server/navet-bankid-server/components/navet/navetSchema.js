const Joi = require('joi');

// demands an object which continas a variable named name which contains a string
const getPerson = Joi.object().keys({
    id: Joi.number().required()
});

module.exports = {
    '/getPerson': getPerson
};
