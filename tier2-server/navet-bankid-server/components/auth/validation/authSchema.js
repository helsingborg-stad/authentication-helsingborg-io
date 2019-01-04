const Joi = require('joi');

const personalNumber = Joi.string().regex(/^[0-9]{12}$/).required();

const authSchema = Joi.object().keys({
    personalNumber,
    endUserIp: Joi.string().required(),
    userVisibleData: Joi.string()
});

module.exports = {
    authSchema
};
