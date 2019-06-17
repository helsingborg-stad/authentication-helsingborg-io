// Write all your general swagger specification here so they can be imported to all swagger schemas.
const stringWithLimit = (min, max) => ({
  type: 'string',
  minLength: min,
  maxLength: max,
});

const date = () => ({
  type: 'string',
  format: 'date',
});

// Definitions
const ValidationError = {
  type: 'object',
  properties: {
    status: {
      type: 'integer',
      format: 'int64',
    },
    name: {
      type: 'string',
    },
    data: {
      type: 'object',
    },
  },
  example: {
    name: 'ValidationError',
    status: 422,
    data: {
      object: {
        person_id: '1',
      },
      details: [
        {
          message: 'person_id length must be at least 5 characters long',
          type: 'string.min',
        },
      ],
    },
  },
};

const definitions = {
  ValidationError,
};

module.exports = {
  stringWithLimit,
  date,
  definitions,
};
