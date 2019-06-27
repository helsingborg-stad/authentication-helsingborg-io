const { validate } = require('../validation/validation');
const { WeakValidationError } = require('../utils/error');
const logger = require('../utils/logger');

// Joi validation options
const validationOptions = {
  abortEarly: false, // abort after the last validation error
  allowUnknown: true, // allow unknown keys that will be ignored
  stripUnknown: true, // remove unknown keys from the validated data
};

/**
 * @param {Object} schema - the JOI Schema to validate against
 * @param {Boolean} detailedError - flag stating whether a detail error should be returned or not
 *
 * @returns {Function} the validation middleware
 */
const middleware = (schema, field = 'body', detailedError = false) => (req, res, next) => {
  validate(req[field], schema, validationOptions)
    .then((validated) => {
      req[field] = validated;
      next();
    })
    .catch((e) => {
      logger.error(e);

      const err = detailedError
        ? e
        : new WeakValidationError('Invalid request data. Please review request and try again.');

      res.status(err.status || 422).json(err);
    });
};

module.exports = middleware;
