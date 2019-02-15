const fs = require('fs');
const axios = require('axios');
const https = require('https');
const mysql = require('mysql');

exports.createOrder = async (request) => {
    try {
        const { totalAmount } = request;

        const localOrderId = await createLocalOrder({
            Date: Date.now(),
            UserId: 1,
            TotalAmount: totalAmount,
            Status: 100
        });

        console.log('localOrder', localOrderId);

        const endpoint = `${process.env.PAYMENTAPIURL}/orders/create`;

        const data = {
            OrderNumber: `${localOrderId + 1000}`,
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
                Id: '1'
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

const createLocalOrder = async (inputData) => {
    return new Promise(function (resolve, reject) {
        try {
            const db = mysql.createConnection({
                host: process.env.DBHOST,
                port: process.env.DBPORT,
                user: process.env.DBUSER,
                password: process.env.DBPASSWORD,
                database: process.env.DBNAME
            });

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

            db.end();
        } catch (error) {
            reject(error);
        }
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
