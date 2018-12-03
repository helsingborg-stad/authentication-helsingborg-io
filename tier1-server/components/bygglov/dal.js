const redis = require('redis');
const axios = require('axios');
const https = require('https');
const client = redis.createClient();
const fs = require('fs');

client.on('error', (err) => {
    console.log('Error ' + err);
});

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

exports.getBygglov = async (body) => {
    try {
        console.log('teir1dal');
        const id = body.id;
        try {
            const res = await axiosClient.post(process.env.navetUrl, { id });
            return res.data;
        } catch (error) {
            return error;
        }
    } catch (error) {
        return error;
    }
};
