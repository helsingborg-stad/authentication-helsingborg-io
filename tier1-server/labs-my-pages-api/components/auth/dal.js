const fs = require('fs');
const axios = require('axios');
const https = require('https');

exports.authenticate = async (pno, endUserIp, userVisibleData) => {
    try {
        try {
            return {
                pno
            };
        } catch (error) {
            return error;
        }
    } catch (error) {
        return error;
    }
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
