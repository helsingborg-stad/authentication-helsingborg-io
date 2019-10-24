/* eslint-disable default-case */
/* eslint-disable no-undef */
const axios = require('axios');
const https = require('https');
const logger = require('../../utils/logger');
const jsonapi = require('../../jsonapi');
const { BadRequestError } = require('../../utils/error');

const BANKID_CA = process.env.BANKID_CA_STRING;
const { BANKID_API_URL } = process.env;
const { BANKID_PASSPHRASE } = process.env;
const BANKID_PFX_BASE64 = Buffer.from(process.env.BANKID_PFX_BASE64, 'base64'); // Stored as an base64 converted env variable.

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

/**
 * Do auth request again if order is already in progress
 * @param {obj} err
 */
const retryFailedRequest = (err) => {
  if (
    typeof err.response.status !== 'undefined'
    && err.response.status === 400
    && typeof err.response.data.errorCode !== 'undefined'
    && err.response.data.errorCode === 'alreadyInProgress'
    && err.config
    && !err.config.isRetryRequest) {
    err.config.isRetryRequest = true;
    return client(err.config);
  }
  throw err;
};

client.interceptors.response.use(undefined, retryFailedRequest);

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

const createErrorResponse = async (error, res) => {
  logger.error(error);
  const serializedData = await jsonapi.serializer.serializeError(error);
  return res.status(error.status).json(serializedData);
};

const createSuccessResponse = async (data, res, jsonapiType, converter) => {
  const convertData = await jsonapi.convert[converter](data);
  const serializedData = await jsonapi.serializer.serialize(jsonapiType, convertData);
  return res.json(serializedData);
};

/**
 * CREATE RESOURCE METHODS
 */

// Authentication call with Bank Id
const auth = async (req, res) => {
  try {
    const { endUserIp, personalNumber } = req.body;

    const resourceData = await call('/auth', {
      endUserIp,
      personalNumber,
    });

    if (resourceData.status === 400) {
      throw new BadRequestError(resourceData.data.details);
    }

    return await createSuccessResponse(resourceData.data, res, 'auth', 'createId');
  } catch (error) {
    return createErrorResponse(error, res);
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

    return await createSuccessResponse(resourceData.data, res, 'sign', 'createId');
  } catch (error) {
    return createErrorResponse(error, res);
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

    const resourceData = await call('/collect', {
      orderRef,
    });

    if (resourceData.status === 400) {
      throw new BadRequestError(resourceData.data.details);
    }

    return await createSuccessResponse(resourceData.data, res, 'collect', 'createId');
  } catch (error) {
    return createErrorResponse(error, res);
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

    return await createSuccessResponse(resourceData.data, res, 'cancel', 'createId');
  } catch (error) {
    return createErrorResponse(error, res);
  }
};

const del = {
  order: cancel,
};

module.exports = {
  create,
  read,
  del,
};
