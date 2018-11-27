const Joi = require('joi');

module.exports = {
    body: {
        id: Joi.string().regex(/^[0-9]{12}$/).required()
    }
};
