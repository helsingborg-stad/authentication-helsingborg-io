const fs = require('fs');
const axios = require('axios');
const https = require('https');
const mysql = require('mysql');

exports.createOrder = async (request) => {
    try {
        const { totalAmount, personalNumber } = request;

        const users = await getUser(personalNumber);

        const localOrderId = await createLocalOrder({
            Date: Date.now(),
            UserId: users ? users[0].Id : null,
            TotalAmount: totalAmount,
            Status: 100
        });

        console.log('localOrderId', localOrderId);

        const externalOrderId = getExternalOrderId(localOrderId);
        await updateExternalOrderId(localOrderId, externalOrderId);

        const endpoint = `${process.env.PAYMENTAPIURL}/orders/create`;

        const data = {
            OrderNumber: externalOrderId,
            CurrencyCode: 'SEK',
            TotalAmount: totalAmount
        };

        const response = await axiosClient.post(endpoint, data).then(response => {
            if (response.status !== 200) {
                console.log(response.status);
                console.log(response.data);
                return null;
            } else {
                return response.data.orderId;
            }
        });

        return response;
    } catch (error) {
        console.log('error', error.response.status);
        console.log('error', error.response.statusText);
        return error.Error;
    }
};

exports.initializePayment = async (request, orderId) => {
    try {
        const endpoint = `${process.env.PAYMENTAPIURL}/orders/${orderId}/initializePayment/`;

        const data = {
            OrderId: orderId,
            TotalAmount: request.totalAmount,
            PaymentChannelId: 1,
            PaymentMethods: [{
                Id: '99'
            }],
            InterfaceOptions: {
                InterfaceId: 5,
                LayoutName: 'Paynova_Fullpage_1',
                CustomerLanguageCode: 'SWE',
                UrlRedirectSuccess: `${request.host}/lediga-tomter/#/tomt/reservera/betalning/bekraftelse/${orderId}`,
                UrlRedirectCancel: `${request.host}/lediga-tomter/#/tomt/reservera/betalning/bekraftelse/${orderId}`,
                UrlRedirectPending: `${request.host}/lediga-tomter/#/tomt/reservera/betalning/bekraftelse/${orderId}`
            }
        };

        const response = await axiosClient.post(endpoint, data).then(response => {
            console.log(response.data);
            if (response.status !== 200) {
                console.log(response.status);
                return null;
            } else {
                return response.data;
            }
        });

        return response;
    } catch (error) {
        return error;
    }
};

exports.confirmPayment = async (orderId) => {
    try {
        const orders = await getLocalOrder(orderId);
        let updated = false;

        if (orders && orders[0].Status !== 200) {
            updated = await updateOrderStatus(orderId, 200).then((r) => {
                return r;
            });
        }

        return Object.assign({}, {
            OrderId: orders[0].Id,
            TotalAmount: orders[0].TotalAmount,
            Status: updated ? 200 : orders[0].Status,
            UserId: orders[0].UserId,
            ExternalOrderId: orders[0].ExternalOrderId
        });
    } catch (error) {
        return error;
    }
};

const getLocalOrder = async (orderId) => {
    return new Promise(function (resolve, reject) {
        try {
            const db = getDbConnection();

            db.connect(err => {
                if (err) throw err;
                var sql = 'SELECT * FROM orders WHERE ExternalOrderId = ' + mysql.escape(orderId);
                db.query(sql, function (err, result) {
                    if (err) throw err;
                    resolve(result);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

const createLocalOrder = async (inputData) => {
    return new Promise(function (resolve, reject) {
        try {
            const db = getDbConnection();

            db.connect((err) => {
                if (err) {
                    reject(err);
                }
                console.log('Connected to database');
            });

            db.query('INSERT INTO orders SET ?', inputData, function (error, results, fields) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                resolve(results.insertId);
            });
        } catch (error) {
            reject(error);
        }
    });
};

const updateExternalOrderId = async (localOrderId, externalOrderId) => {
    return new Promise(function (resolve) {
        try {
            const db = getDbConnection();

            db.connect(err => {
                if (err) throw err;
                var sql = 'UPDATE orders SET ExternalOrderId = ' + mysql.escape(externalOrderId) + ' WHERE Id = ' + mysql.escape(localOrderId);
                db.query(sql, function (err, result) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    resolve(true);
                    console.log(result.affectedRows + ' record(s) updated');
                });
            });
        } catch (error) {
            console.log(error);
            resolve(false);
        }
    });
};

const updateOrderStatus = (externalOrderId, statusCode) => {
    return new Promise(function (resolve) {
        try {
            const db = getDbConnection();

            db.connect(err => {
                if (err) throw err;
                var sql = 'UPDATE orders SET Status = ' + mysql.escape(statusCode) + ' WHERE ExternalOrderId = ' + mysql.escape(externalOrderId);
                db.query(sql, function (err, result) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    resolve(true);
                    console.log(result.affectedRows + ' record(s) updated');
                });
            });
        } catch (error) {
            console.log(error);
            resolve(false);
        }
    });
};

const getUser = async (personalNumber) => {
    return new Promise(function (resolve, reject) {
        try {
            const db = getDbConnection();

            db.connect(err => {
                if (err) throw err;
                var sql = 'SELECT * FROM users WHERE PersonalNumber = ' + mysql.escape(personalNumber);
                db.query(sql, function (err, result) {
                    if (err) throw err;
                    resolve(result);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getExternalOrderId = (orderId) => {
    return `${orderId + 1000}`;
};

const getDbConnection = () => {
    return mysql.createConnection({
        host: process.env.DBHOST,
        port: process.env.DBPORT,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME
    });
};

const axiosClient = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        cert: fs.readFileSync(process.env.SERVERCERT),
        key: fs.readFileSync(process.env.SERVERKEY)
    }),
    headers: {
        'Content-Type': 'application/json'
    }
});
