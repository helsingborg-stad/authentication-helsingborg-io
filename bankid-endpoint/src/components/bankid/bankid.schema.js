const Joi = require('@hapi/joi');
const { id, limit } = require('../../validation/global.schema');

// Generic Schema.
const genericSchema = Joi.object().keys({
  person_id: id.required(),
});

const postSchema = Joi.object().keys({
  person_id: id.required(),
});

const putSchema = Joi.object().keys({ });

const querySchema = Joi.object().keys({
  person_id: id,
  limit,
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
};
