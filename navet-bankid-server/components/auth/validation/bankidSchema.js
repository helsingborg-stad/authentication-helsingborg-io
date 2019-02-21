const Joi = require('joi');

module.exports = Joi.object({
    personalNumber: Joi.string().required(),
    name: Joi.string().required(),
    givenName: Joi.string().required(),
    surname: Joi.string().required()
});
