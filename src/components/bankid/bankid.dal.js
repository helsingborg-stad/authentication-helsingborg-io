/* eslint-disable default-case */
/* eslint-disable no-undef */
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const config = require('config');
const logger = require('../../utils/logger');

const BANKID_API_URL = config.get('BANKID.API_URL');
const BANKID_CA = config.get('BANKID.CA');
const BANKID_PFX_PATH = config.get('BANKID.PFX_PATH');
const BANKID_PASSPHRASE = config.get('BANKID.PASSPHRASE');

const client = axios.create({
  httpsAgent: new https.Agent({
    ca: BANKID_CA,
    pfx: fs.readFileSync(BANKID_PFX_PATH),
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

// Authentication call with Bank Id
const auth = async (endUserIp, personalNumber) => {
  try {
    if (!endUserIp) {
      return {
        status: 400,
        message: 'Missing required arguments: endUserIp.',
        errorCode: 'invalidParameters',
      };
    }

    return await call('/auth', {
      endUserIp,
      personalNumber,
    });
  } catch (error) {
    logger.info('error', error);
    return res.status(error.status || 500).json(error);
  }
};

// Signature call with Bank Id
const sign = async (endUserIp, personalNumber, userVisibleData) => {
  try {
    if (!endUserIp) {
      return {
        status: 400,
        message: 'Missing required arguments: endUserIp.',
        errorCode: 'invalidParameters',
      };
    }

    return await call('/sign', {
      personalNumber: personalNumber.toString(),
      endUserIp: endUserIp.toString(),
      userVisibleData: userVisibleData
        ? Buffer.from(userVisibleData).toString('base64')
        : undefined,
    });
  } catch (error) {
    logger.info('error', error);
    return res.status(error.status || 500).json(error);
  }
};

// Collect call with Bank Id
const collect = async (orderRef) => {
  try {
    if (!orderRef) {
      return {
        status: 400,
        message: 'Missing required arguments: orderRef.',
        errorCode: 'invalidParameters',
      };
    }

    return await call('/collect', {
      orderRef,
    });
  } catch (error) {
    logger.info('error', error);
    return res.status(error.status || 500).json(error);
  }
};


// Cancel call with Bank Id
const cancel = async (orderRef) => {
  try {
    if (!orderRef) {
      return {
        status: 400,
        message: 'Missing required arguments: orderRef.',
        errorCode: 'invalidParameters',
      };
    }

    return await call('/cancel', {
      orderRef,
    });
  } catch (error) {
    logger.info('error', error);
    return res.status(error.status || 500).json(error);
  }
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
  auth,
  sign,
  collect,
  cancel,
  signAndCollect,
  authAndCollect,
};
