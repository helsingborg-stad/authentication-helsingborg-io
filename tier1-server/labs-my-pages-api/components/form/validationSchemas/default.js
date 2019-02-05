const Joi = require('joi');
const globalSchema = require('./global');

module.exports = Joi.object({
    // id: globalSchema.id
});
