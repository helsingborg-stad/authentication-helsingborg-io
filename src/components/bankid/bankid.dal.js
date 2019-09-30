/* eslint-disable default-case */
/* eslint-disable no-undef */
const axios = require('axios');
const https = require('https');
const logger = require('../../utils/logger');
const jsonapi = require('../../jsonapi');
const { BadRequestError, ResourceNotFoundError } = require('../../utils/error');

const BANKID_CA = process.env.BANKID_CA_STRING;
const { BANKID_API_URL } = process.env;
const { BANKID_PASSPHRASE } = process.env;
const BANKID_PFX_BASE64 = new Buffer(process.env.BANKID_PFX_BASE64, 'base64'); // Stored as an base64 converted env variable.

const client = axios.create({
  httpsAgent: new https.Agent({
    ca: BANKID_CA,
    pfx: BANKID_PFX_BASE64,
    passphrase: BANKID_PASSPHRASE,
    rejectUnauthorized: false,
  }),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});
// Wrapper for all calls to bankId
const call = (path, payload) => client.post(BANKID_API_URL + path, payload)
  .then(response => (response.status === 200
    ? {
      status: response.status,
      data: response.data,
    }
    : {
      status: response.status,
      message: response.data.details,
      errorCode: response.data.errorCode,
    }))
  .catch((error) => {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // logger.info('error.data', error.response.data);
    // logger.info('error.status', error.response.status);
    // logger.info('error.headers', error.response.headers);
    if (error.response) return error.response;

    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    if (error.request) logger.info(error.request);
    else {
      // Something happened in setting up the request that triggered an Error
      logger.info('Error', error.message);
    }
    logger.info(error.config);
    return res.status(error.status || 500).json(error);
  });

const collectUntilDone = orderRef => new Promise((resolve, reject) => {
  let counter = 0;
  const timer = setInterval(async () => {
    try {
      counter += 1;
      let res;
      // 5min limit
      if (counter === 150) {
        clearInterval(timer);
      }
      const collectResponse = await call('/collect', {
        orderRef,
      });
      switch (collectResponse.data.status) {
        case 'complete':
          clearInterval(timer);
          res = resolve(collectResponse);
          break;
        case 'failed':
          clearInterval(timer);
          res = resolve(collectResponse.hintCode);
          break;
      }
      return res;
    } catch (err) {
      clearInterval(timer);
      return reject(err);
    }
  }, 2000);
});


/**
 * CREATE RESOURCE METHODS
 */

// Authentication call with Bank Id
const auth = async (req, res) => {
  try {
    const { endUserIp, personalNumber } = req.body;

    if (!endUserIp) {
      throw new BadRequestError('Missing required arguments: endUserIp.');
    }

    const resourceData = await call('/auth', {
      endUserIp,
      personalNumber,
    });

    if (resourceData.status === 400) {
      throw new BadRequestError(resourceData.data.details);
    }

    const convertData = jsonapi.convert.createId(resourceData.data);
    const response = jsonapi.serializer.serialize('auth', convertData);

    return response;
  } catch (error) {
    logger.error(error);
    const errorResponse = await jsonapi.serializer.serializeError(error);
    return res.status(error.status).json(errorResponse);
  }
};

// Signature call with Bank Id
const sign = async (req, res) => {
  try {
    const { endUserIp, personalNumber, userVisibleData } = req.body;

    const resourceData = await call('/sign', {
      personalNumber: personalNumber ? personalNumber.toString() : undefined,
      endUserIp: endUserIp ? endUserIp.toString() : undefined,
      userVisibleData: userVisibleData
        ? Buffer.from(userVisibleData).toString('base64')
        : undefined,
    });

    if (resourceData.status === 400) {
      throw new BadRequestError(resourceData.data.details);
    }

    const convertData = jsonapi.convert.createId(resourceData.data);
    const response = jsonapi.serializer.serialize('sign', convertData);

    return response;
  } catch (error) {
    logger.error(error);
    const errorResponse = await jsonapi.serializer.serializeError(error);
    return res.status(error.status).json(errorResponse);
  }
};

const create = {
  auth,
  sign,
};

/**
 * READ RESOURCE METHODS
 */

const collect = async (req, res) => {
  // Write method for reading a resource (in this case a get request towards the testapi)
  try {
    const { orderRef } = req.body;

    if (!orderRef) {
      throw new BadRequestError('Missing required arguments: orderRef.');
    }

    const resourceData = await call('/collect', {
      orderRef,
    });

    if (resourceData.status === 400) {
      throw new BadRequestError(resourceData.data.details);
    }

    const convertData = jsonapi.convert.createId(resourceData.data);
    const response = jsonapi.serializer.serialize('collect', convertData);

    return response;
  } catch (error) {
    logger.error(error);
    const errorResponse = await jsonapi.serializer.serializeError(error);
    return res.status(error.status).json(errorResponse);
  }
};

const read = {
  order: collect,
};


/**
 * DELETE RESOURCE METHODS
 */

// Cancel call with Bank Id
const cancel = async (req, res) => {
  try {
    const { orderRef } = req.body;

    if (!orderRef) {
      throw new BadRequestError('Missing required arguments: orderRef.');
    }

    const resourceData = await call('/cancel', {
      orderRef,
    });

    if (resourceData.status === 400) {
      throw new BadRequestError(resourceData.data.details);
    }

    const convertData = jsonapi.convert.createId(resourceData.data);
    const response = jsonapi.serializer.serialize('cancel', convertData);

    return response;
  } catch (error) {
    logger.error(error);
    const errorResponse = await jsonapi.serializer.serializeError(error);
    return res.status(error.status).json(errorResponse);
  }
};

const del = {
  order: cancel,
};

// Signature and Status Collection call from Bank Id
const signAndCollect = async (endUserIp, personalNumber, userVisibleData) => {
  try {
    if (!endUserIp) {
      return {
        status: 400,
        message: 'Missing required arguments: endUserIp.',
        errorCode: 'invalidParameters',
      };
    }

    const signingResponse = await call('/sign', {
      personalNumber: personalNumber.toString(),
      endUserIp: endUserIp.toString(),
      userVisibleData: userVisibleData
        ? Buffer.from(userVisibleData).toString('base64')
        : undefined,
    });

    if (signingResponse.status !== 200) return response;

    return collectUntilDone(signingResponse.data.orderRef);
  } catch (error) {
    logger.info('error', error);
    return res.status(error.status || 500).json(error);
  }
};

// Authenticate and Status Collection call from Bank Id
const authAndCollect = async (endUserIp, personalNumber) => {
  try {
    if (!endUserIp) {
      return {
        status: 400,
        message: 'Missing required arguments: endUserIp.',
        errorCode: 'invalidParameters',
      };
    }

    const authenticationResponse = await call('/auth',
      {
        endUserIp: endUserIp.toString(),
        personalNumber: personalNumber.toString(),
      });

    if (authenticationResponse.status !== 200) return response;

    return collectUntilDone(authenticationResponse.data.orderRef);
  } catch (error) {
    logger.info('error', error);
    return res.status(error.status || 500).json(error);
  }
};

module.exports = {
  create,
  read,
  del,
  signAndCollect,
  authAndCollect,
};
