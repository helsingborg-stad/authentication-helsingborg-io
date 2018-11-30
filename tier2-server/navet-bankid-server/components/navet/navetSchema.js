const Joi = require('joi');

const id = Joi.string().regex(/^[0-9]{12}$/).required();
const obj = Joi.object();

const body = obj.keys({
    id: id
});

module.exports = {
    body
};
