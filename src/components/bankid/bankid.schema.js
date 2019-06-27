const Joi = require('@hapi/joi');
const { limit } = require('../../validation/global.schema');
const personalNumber = Joi.string().regex(/^[0-9]{12}$/).required();

const authenticationSchema = Joi.object().keys({
    personalNumber: Joi.personalNumber(),
    endUserIp: Joi.string().required(),
    userVisibleData: Joi.string()
});

const signatureSchema = Joi.object().keys({
  personalNumber: Joi.personalNumber(),
  endUserIp: Joi.string().required(),
  userVisibleData: Joi.string().required(),
  userNonVisibleData: Joi.string().required(),
});

const responseSchema = Joi.object().keys({
  autoStartToken: Joi.string().required(),
  orderRef: Joi.string().required(),
});

module.exports = {
  signatureSchema,
  responseSchema,
  authenticationSchema,
};
