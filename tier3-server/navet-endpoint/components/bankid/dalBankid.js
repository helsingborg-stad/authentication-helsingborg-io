/* eslint-disable no-undef */
const axios = require('axios');
const https = require('https');
const path = require('path');
var fs = require('fs');

const apiUrl = 'https://appapi2.test.bankid.com/rp/v5';
const testPassphrase = 'qwerty123';
const ca = path.resolve(__dirname, '../../../../localConfig/bankid.ca');
const pfx = path.resolve(__dirname, '../../../../localConfig/FPTestcert2.pfx');

const client = axios.create({
    httpsAgent: new https.Agent({
        ca: fs.readFileSync(ca),
        pfx: fs.readFileSync(pfx),
        passphrase: testPassphrase,
        rejectUnauthorized: false
    }),
    headers: {
        'Content-Type': 'application/json'
    }
});

const getErrorDetails = (statusCode, message, httpStatus) => {
    return {
        bankidErrorCode: statusCode,
        message: message,
        status: httpStatus
    };
};

const call = async (path, payload) => {
    try {
        const response = await client.post(apiUrl + path, payload);

        return {
            status: response.status,
            data: response.data
        };
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log('error.data', error.response.data);
            // console.log('error.status', error.response.status);
            // console.log('error.headers', error.response.headers);
            return error.response;
        } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
            console.log(error.request);
        } else {
        // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
};

exports.auth = async (endUserIp) => {
    try {
        if (!endUserIp) {
            return getErrorDetails('invalidParameters', 'Missing required arguments: endUserIp.', 400);
        }

        const response = await call('/auth', {
            endUserIp
        });

        if (response.status !== 200) {
            return getErrorDetails(response.data.errorCode, response.data.details, response.status);
        }

        return response;
    } catch (error) {
        console.log('error', error);
    }
};

exports.sign = async (endUserIp, personalNumber, userVisibleData) => {
    try {
        if (!endUserIp) {
            return getErrorDetails('invalidParameters', 'Missing required arguments: endUserIp.');
        }

        const response = await call('/sign', {
            personalNumber: personalNumber.toString(),
            endUserIp: endUserIp.toString(),
            userVisibleData: userVisibleData
                ? Buffer.from(userVisibleData).toString('base64')
                : undefined
        });

        if (response.status !== 200) {
            return getErrorDetails(response.data.errorCode, response.data.details, response.status);
        }

        return response;
    } catch (error) {
        console.log('error', error);
    }
};

exports.collect = async (orderRef) => {
    try {
        if (!orderRef) {
            return getErrorDetails('invalidParameters', 'Missing required arguments: orderRef.');
        }

        const response = await call('/collect', {
            orderRef
        });

        if (response.status !== 200) {
            return getErrorDetails(response.data.errorCode, response.data.details, response.status);
        }

        return response;
    } catch (error) {
        console.log('error', error);
    }
};
