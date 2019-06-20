const Joi = require('@hapi/joi');
const { id, limit } = require('../../validation/global.schema');
const personalNumber = Joi.string().regex(/^[0-9]{12}$/).required();

// Generic Schema.
const genericSchema = Joi.object().keys({
  personalNumber: Joi.string().required(),
  name: Joi.string().required(),
  givenName: Joi.string().required(),
  surname: Joi.string().required()
});

const userSchema = Joi.object().keys({
    personalNumber,
    endUserIp: Joi.string().required(),
    userVisibleData: Joi.string()
});

const responseSchema = Joi.object().keys({
  person_id: id.required(),
});

module.exports = {
  genericSchema,
  querySchema,
  putSchema,
  postSchema,
  responseSchema,
  authSchema,
};
