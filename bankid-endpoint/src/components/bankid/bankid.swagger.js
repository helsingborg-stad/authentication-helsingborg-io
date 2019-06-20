const { stringWithLimit } = require('../../../swagger/global.swagger');

const userSchema = {
  User: {
    type: 'object',
    properties: {
      endUserIp: {
        type: 'string',
        required: true,
      },
      personalNumber: {
        type: 'string',
      },
      userVisibleData: {
        type: 'string',
      },
    },
    example: {
      endUserIp: 10,
      personalNumber: '19990929-9999',
      userVisibleData: 'john_snow',
    },
  },
};

const authPath = {
  post: {
    tags: ['Bankid'],
    description: 'Authenticate',
    summary: 'Authentication Service with End user ip and User personalNumber',
    operationId: 'authenticate',
    parameters: [
      {
        in: 'body',
        name: 'body',
        description: 'The user to authenticate',
        required: true,
        schema: {
          type: 'object',
          properties: {
            endUserIp: {
              type: 'string',
              required: true,
            },
            personalNumber: {
              type: 'string',
              required: true,
            },
            userVisibleData: {
              type: 'string',
              required: true,
            },
          },
          example: {
            user_id: 'john_snow',
            service_id: 'iron_bank',
            message: "Who's that blonde?",
          },
        },
      },
    ],
    responses: {
      200: {
        description: 'Authentication successfully.',
      },
      400: {
        description: 'Invalid Parameters',
        schema: {
          $ref: '#/definitions/AuthenticationError',
        },
      },
    },
  },
};
const signPath = {
  post: {
    tags: ['CRUD operations'],
    description: 'Add a notification',
    summary: 'Add Notification with Service id and User id',
    operationId: 'addNotification',
    parameters: [
      {
        in: 'body',
        name: 'body',
        description: 'The notification to create.',
        required: true,
        schema: {
          type: 'object',
          properties: {
            user_id: {
              required: true,
              ...stringWithLimit(5, 24),
            },
            service_id: {
              type: 'string',
              required: true,
            },
            pointer: {
              ...stringWithLimit(0, 50),
            },
            message: {
              ...stringWithLimit(10, 1000),
              required: true,
            },
          },
          example: {
            user_id: 'john_snow',
            service_id: 'iron_bank',
            message: "Who's that blonde?",
          },
        },
      },
    ],
    responses: {
      200: {
        description: 'Notification created successfully.',
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
const collectPath = {
  post: {
    tags: ['CRUD operations'],
    description: 'Add a notification',
    summary: 'Add Notification with Service id and User id',
    operationId: 'addNotification',
    parameters: [
      {
        in: 'body',
        name: 'body',
        description: 'The notification to create.',
        required: true,
        schema: {
          type: 'object',
          properties: {
            user_id: {
              required: true,
              ...stringWithLimit(5, 24),
            },
            service_id: {
              type: 'string',
              required: true,
            },
            pointer: {
              ...stringWithLimit(0, 50),
            },
            message: {
              ...stringWithLimit(10, 1000),
              required: true,
            },
          },
          example: {
            user_id: 'john_snow',
            service_id: 'iron_bank',
            message: "Who's that blonde?",
          },
        },
      },
    ],
    responses: {
      200: {
        description: 'Notification created successfully.',
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
const cancelPath = {
  post: {
    tags: ['CRUD operations'],
    description: 'Add a notification',
    summary: 'Add Notification with Service id and User id',
    operationId: 'addNotification',
    parameters: [
      {
        in: 'body',
        name: 'body',
        description: 'The notification to create.',
        required: true,
        schema: {
          type: 'object',
          properties: {
            user_id: {
              required: true,
              ...stringWithLimit(5, 24),
            },
            service_id: {
              type: 'string',
              required: true,
            },
            pointer: {
              ...stringWithLimit(0, 50),
            },
            message: {
              ...stringWithLimit(10, 1000),
              required: true,
            },
          },
          example: {
            user_id: 'john_snow',
            service_id: 'iron_bank',
            message: "Who's that blonde?",
          },
        },
      },
    ],
    responses: {
      200: {
        description: 'Notification created successfully.',
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
  signPath,
  authPath,
  cancelPath,
  collectPath,
  userSchema,
};
