const redis = require('redis');
const axios = require('axios');
const https = require('https');
const client = redis.createClient();
const fs = require('fs');

client.on('error', (err) => {
    console.log('Error ' + err);
});

const url = 'https://localhost:3000/getPerson';

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

exports.getPerson = async (body) => {
    try {
        const id = body.id;
        let reply = await hget(id);
        if (reply) {
            console.log('i found him in database');
            return JSON.parse(reply);
        } else {
            console.log('i didnt find him');
            const res = await axiosClient.post(url, { id });
            console.log(res)
            const stringData = await JSON.stringify(res.data);
            // await hset(id, stringData);
            return res.data;
        }
    } catch (error) {
        return error;
    }
};

const hget = (id) => {
    return new Promise((resolve, reject) => {
        client.hget('persons', id, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
};

const hset = (id, stringData) => {
    return new Promise((resolve, reject) => {
        client.hmset('persons', id, stringData, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
};
