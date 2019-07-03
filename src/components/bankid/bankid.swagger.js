const { stringWithLimit } = require('../../../swagger/global.swagger');

const stringObjectRequired = {
  type: 'string',
  required: true,
};
const completionDataSchema = {
  completionData: {
    type: 'object',
    required: true,
    properties: {
      user: {
        type: 'object',
        required: true,
        properties: {
          personalNumber: {
            ...stringObjectRequired,
          },
          name: {
            ...stringObjectRequired,
          },
          givenName: {
            ...stringObjectRequired,
          },
          surname: {
            ...stringObjectRequired,
          },
        },
      },
      device: {
        type: 'object',
        required: true,
        ipAddress: {
          ...stringObjectRequired,
        },
      },
      cert: {
        type: 'object',
        required: true,
        notBefore: {
          ...stringObjectRequired,
        },
        notAfter: {
          ...stringObjectRequired,
        },
      },
      signature: {
        ...stringObjectRequired,
        format: 'Base64',
      },
      ocspResponse: {
        ...stringObjectRequired,
        format: 'Base64',
      },
    },
  },
};
const responsesSchema = {
  authenticationSignatureResponse: {
    type: 'object',
    properties: {
      autoStartToken: {
        required: true,
        type: 'string',
      },
      orderRef: {
        type: 'string',
        required: true,
      },
    },
    example: {
      orderRef: '131daac9-16c6-4618-beb0-365768f37288',
      autoStartToken: '7c40b5c9-fa74-49cf-b98c-bfe651f9a7c6',
    },
  },
  pendingCollectResponse: {
    type: 'object',
    properties: {
      orderRef: {
        type: 'string',
        required: true,
      },
      hintCode: {
        type: 'string',
        required: true,
      },
      status: {
        type: 'string',
        required: true,
      },
    },
    example: {
      orderRef: '131daac9-16c6-4618-beb0-365768f37288',
      status: 'pending',
      hintCode: 'userSign',
    },
  },
  failedCollectResponse: {
    type: 'object',
    properties: {
      orderRef: {
        type: 'string',
        required: true,
      },
      status: {
        type: 'string',
        required: true,
      },
      hintCode: {
        type: 'string',
        required: true,
      },
    },
    example: {
      orderRef: '131daac9-16c6-4618-beb0-365768f37288',
      status: 'failed',
      hintCode: 'userCancel',
    },
  },
  completedCollectResponse: {
    type: 'object',
    properties: {
      orderRef: {
        type: 'string',
        required: true,
      },
      status: {
        type: 'string',
        required: true,
      },
      ...completionDataSchema,
    },
    example: {
      orderRef: '131daac9-16c6-4618-beb0-365768f37288',
      status: 'complete',
      completionData: {
        user: {
          personalNumber: '190000000000',
          name: 'Karl Karlsson',
          givenName: 'Karl',
          surname: 'Karlsson',
        },
        device: {
          ipAddress: '192.168.0.1',
        },
        cert: {
          notBefore: '1502983274000',
          notAfter: '1563549674000',
        },
        signature: '<base64-encoded data>',
        ocspResponse: '<base64-encoded data>',
      },
    },
  },
};

const authPath = {
  post: {
    tags: ['Authentication'],
    description: 'Authenticate',
    summary: 'Authentication Service with End user ip and User personalNumber',
    operationId: 'authenticate',
    parameters: [
      {
        in: 'body',
        name: 'body',
        description: 'The user end ip to authenticate',
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
            },
            userVisibleData: {
              type: 'string',
            },
          },
          example: {
            endUserIp: '194.168.2.25',
            personalNumber: '190000000000',
            userVisibleData: 'IFRoaXMgaXMgYSBzYW1wbGUgdGV4dCB0byBiZSBzaWduZWQ=',
          },
        },
      },
    ],
    responses: {
      200: {
        description: 'Authentication successfully.',
        schema: {
          $ref: '#/definitions/authenticationSignatureResponse',
        },
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

const authAndCollectPath = {
  post: {
    tags: ['Authentication'],
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
            endUserIp: '0.0.0.0',
            personalNumber: '19990929-9999',
            userVisibleData: 'IFRoaXMgaXMgYSBzYW1wbGUgdGV4dCB0byBiZSBzaWduZWQ=',
          },
        },
      },
    ],
    responses: {
      200: {
        description: 'Authentication successfully.',
        schema: {
          $ref: '#/definitions/authenticationSignatureResponse',
        },
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

const signAndCollectPath = {
  post: {
    tags: ['Signature'],
    description: 'Sign Bank id ',
    summary: 'Sign with the user personal number and ip address',
    operationId: 'Sign',
    parameters: [
      {
        in: 'body',
        name: 'body',
        description: 'The user that´s giving his/her signature',
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
            endUserIp: '0.0.0.0',
            personalNumber: '19990929-9999',
            userVisibleData: 'IFRoaXMgaXMgYSBzYW1wbGUgdGV4dCB0byBiZSBzaWduZWQ=',
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
    tags: ['Signature'],
    description: 'Sign Bank id ',
    summary: 'Sign with the user personal number and ip address',
    operationId: 'Sign',
    parameters: [
      {
        in: 'body',
        name: 'body',
        description: 'The user that´s giving his/her signature',
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
            },
            userVisibleData: {
              type: 'string',
              required: true,
            },
            userNonVisibleData: {
              type: 'string',
            },
          },
          example: {
            endUserIp: '194.168.2.25',
            personalNumber: '190000000000',
            userVisibleData: 'IFRoaXMgaXMgYSBzYW1wbGUgdGV4dCB0byBiZSBzaWduZWQ=',
          },
        },
      },
    ],
    responses: {
      200: {
        description: 'Signature Confirmed.',
        schema: {
          $ref: '#/definitions/authenticationSignatureResponse',
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

const collectPath = {
  post: {
    tags: ['Collection'],
    description: 'Collect Status of request',
    summary: 'Collect the status of a request with the order reference',
    operationId: 'collectOrderRef',
    parameters: [
      {
        in: 'body',
        name: 'body',
        description: 'The order reference of the request to check status.',
        required: true,
        schema: {
          type: 'object',
          properties: {
            orderRef: {
              required: true,
              type: 'string',
            },
          },
          example: {
            orderRef: '131daac9-16c6-4618-beb0-365768f37288',
          },
        },
      },
    ],
    responses: {
      200: {
        description: 'Collection completed successfully.',
        schema: {
          $ref: '#/definitions/completedCollectResponse',
        },
      },
      202: {
        description: 'Collection accepted and pending successfully.',
        schema: {
          $ref: '#/definitions/pendingCollectResponse',
        },
      },
      422: {
        description: 'Validation Error',
        schema: {
          $ref: '#/definitions/failedCollectResponse',
        },
      },
    },
  },
};

const cancelPath = {
  post: {
    tags: ['Cancellation'],
    description: 'Cancel a request',
    summary: 'Cancel an active authentication or signature ',
    operationId: 'cancelOffer',
    parameters: [
      {
        in: 'body',
        name: 'body',
        description: 'The offer to cancel.',
        required: true,
        schema: {
          type: 'object',
          properties: {
            orderRef: {
              required: true,
              ...stringWithLimit(1, 32),
            },
          },
          example: {
            orderRef: '131daac9-16c6-4618-beb0-365768f37288',
          },
        },
      },
    ],
    responses: {
      200: {
        description: 'Cancellation successfully.',
      },
      422: {
        description: 'Cancellation Error',
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
  authAndCollectPath,
  signAndCollectPath,
  responsesSchema,
};
