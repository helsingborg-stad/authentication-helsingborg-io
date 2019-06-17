const { stringWithLimit } = require('../../../swagger/global.swagger');

const personsSchema = {
  Person: {
    type: 'object',
    properties: {
      id: {
        required: true,
        type: 'integer',
      },
      person_id: {
        required: true,
        ...stringWithLimit(5, 24),
      },
    },
    example: {
      id: 10,
      person_id: 'john_snow',
    },
  },
};

const personPath = {
  post: {
    tags: ['CRUD operations'],
    description: 'Add a person',
    summary: 'Add Person with Service id and User id',
    operationId: 'addPerson',
    parameters: [
      {
        in: 'body',
        name: 'body',
        description: 'The person to create.',
        required: true,
        schema: {
          type: 'object',
          properties: {
            person_id: {
              required: true,
              ...stringWithLimit(5, 24),
            },
          },
          example: {
            person_id: 'john_snow',
          },
        },
      },
    ],
    responses: {
      200: {
        description: 'Person created successfully.',
      },
      422: {
        description: 'Validation Error',
        schema: {
          $ref: '#/definitions/ValidationError',
        },
      },
    },
  },
  get: {
    tags: ['CRUD operations'],
    summary: 'Query persons',
    description: 'Query persons by Person id.',
    operationId: 'queryPersons',
    parameters: [
      {
        name: 'person_id',
        in: 'query',
        description: 'The user id of the person',
        type: 'string',
      },
      {
        name: 'limit',
        in: 'query',
        description: 'The number of entities to fetch',
        type: 'integer',
        default: 10,
      },
    ],
    responses: {
      200: {
        description: 'successful operation',
        schema: {
          type: 'array',
          items: {
            $ref: '#/definitions/Person',
          },
        },
      },
      422: {
        description: 'Validation Error',
        schema: {
          $ref: '#/definitions/ValidationError',
        },
      },
    },
  },
};

module.exports = {
  personPath,
  personsSchema,
};
