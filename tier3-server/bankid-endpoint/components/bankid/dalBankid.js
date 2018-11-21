/* eslint-disable no-undef */
const axios = require('axios');
const https = require('https');
const path = require('path');
var fs = require('fs');

exports.signAndCollect = async (endUserIp, personalNumber, userVisibleData) => {
    try {
        if (!endUserIp) {
            return {
                status: 400,
                message: 'Missing required arguments: endUserIp.',
                errorCode: 'invalidParameters'
            };
        }

        return await call('/sign', {
            personalNumber: personalNumber.toString(),
            endUserIp: endUserIp.toString(),
            userVisibleData: userVisibleData
                ? Buffer.from(userVisibleData).toString('base64')
                : undefined
        }).then((response) => {
            if (!response.data) {
                return response;
            };

            const timer = setInterval(() => {
                call('/collect', {
                    orderRef: response.data.orderRef
                })
                    .then((response) => {
                        switch (response.status) {
                            case 'completed':
                                clearInterval(timer);
                                return response;
                            case 'failed' :
                                clearInterval(timer);
                                return response.hintCode;
                            default:
                                console.log(response);
                                break;
                        }
                    })
                    .catch(err => {
                        clearInterval(timer);
                        return err;
                    });
            }, 1000);
        });
    } catch (error) {
        console.log('error', error);
    }
};

exports.auth = async (endUserIp) => {
    try {
        if (!endUserIp) {
            return {
                status: 400,
                message: 'Missing required arguments: endUserIp.',
                errorCode: 'invalidParameters'
            };
        }

        return await call('/auth', {
            endUserIp
        });
    } catch (error) {
        console.log('error', error);
    }
};

exports.sign = async (endUserIp, personalNumber, userVisibleData) => {
    try {
        if (!endUserIp) {
            return {
                status: 400,
                message: 'Missing required arguments: endUserIp.',
                errorCode: 'invalidParameters'
            };
        }

        return await call('/sign', {
            personalNumber: personalNumber.toString(),
            endUserIp: endUserIp.toString(),
            userVisibleData: userVisibleData
                ? Buffer.from(userVisibleData).toString('base64')
                : undefined
        });
    } catch (error) {
        console.log('error', error);
    }
};

exports.collect = async (orderRef) => {
    try {
        if (!orderRef) {
            return {
                status: 400,
                message: 'Missing required arguments: orderRef.',
                errorCode: 'invalidParameters'
            };
        }

        return await call('/collect', {
            orderRef
        });
    } catch (error) {
        console.log('error', error);
    }
};

const call = (path, payload) => {
    return client.post(process.env.BANKID_API_URL + path, payload)
        .then((response) => {
            return response.status === 200
                ? {
                    status: response.status,
                    data: response.data
                }
                : {
                    status: response.status,
                    message: response.data.details,
                    errorCode: response.data.errorCode
                };
        })
        .catch((error) => {
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
        });
};

const client = axios.create({
    httpsAgent: new https.Agent({
        ca: process.env.BANKID_CA,
        pfx: fs.readFileSync(path.resolve(__dirname, process.env.BANKID_PFX_PATH)),
        passphrase: process.env.BANKID_PASSPHRASE,
        rejectUnauthorized: false
    }),
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 5000
});
