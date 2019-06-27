const Joi = require('@hapi/joi');
const { ValidationError, InternalServerError } = require('../utils/error');

// Joi validation options
const validationOptions = {
  abortEarly: false, // abort after the last validation error
  allowUnknown: true, // allow unknown keys that will be ignored
  stripUnknown: true, // remove unknown keys from the validated data
};

// Validating response with Joi
const validate = (input, schema, options = validationOptions) => new Promise((resolve, reject) => {
  try {
    const result = Joi.validate(input, schema, options);
    if (result.error) {
      reject(new ValidationError('Validation failed', result.error));
      return;
    }

    resolve(result);
  } catch (error) {
    reject(new InternalServerError(error.message));
  }
});

module.exports = {
  validate,
};
