const Joi = require('joi');
const globalSchema = require('./global');

// Build your endpoint-specific schema here.
const body = Joi.object().keys({
    id: globalSchema.id
});

module.exports = {
    body
};
