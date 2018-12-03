const redis = require('redis');
const axios = require('axios');
const https = require('https');
const client = redis.createClient();
const fs = require('fs');
const navetData = require('./objectSchemas/navetData');
const bankidData = require('./objectSchemas/bankidData');

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

exports.getPerson = async (body) => {
    try {
        console.log('did i enter');
        const id = body.id;
        let reply = await hget(id);
        if (reply) {
            console.log('i found him in database');
            return JSON.parse(reply);
        } else {
            console.log('i didnt find him');
            const resBankid = await axiosClient.post(process.env.bankidUrl);
            const validResBankid = await validate(resBankid.data, bankidData);

            const res = await axiosClient.post(process.env.navetUrl, { id });
            res.data.id = res.data.Folkbokforingspost.Personpost.PersonId.PersonNr;
            const validResNavet = await validate(res.data, navetData);

            const toBeSaved = { validResNavet, validResBankid };
            const stringData = await JSON.stringify(toBeSaved);
            const saveResponse = await hset(validResNavet.id, stringData);
            return { validResNavet, validResBankid };
        }
    } catch (error) {
        return error;
    }
};

const validate = (input, schema) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(schema.validate(input));
        } catch (error) {
            reject(error);
        }
    });
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
