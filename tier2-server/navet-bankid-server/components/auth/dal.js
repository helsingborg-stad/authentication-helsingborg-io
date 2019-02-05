const redis = require('redis');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const navetSchema = require('./validation/navetSchema');
const bankidSchema = require('./validation/bankidSchema');
const redisClient = redis.createClient();

exports.authenticate = async (request) => {
    try {
        const { personalNumber, endUserIp, userVisibleData } = request;

        let reply = await hget(personalNumber);

        if (reply) {
            console.log('i found him in database');
            return JSON.parse(reply);
        } else {
            console.log('i didnt find him');
            console.log(request);

            const userData = await authenticateWithBankId({
                // personalNumber,
                personalNumber: '198404293279',
                endUserIp,
                userVisibleData
            });

            const navetResponse = await getNavetData(personalNumber);
            // const navetResponse = await getNavetData(personalNumber);

            return {
                user: {
                    personalNumber: userData.personalNumber,
                    name: userData.name,
                    givenName: userData.givenName,
                    surname: userData.surname,
                    navet: navetResponse
                }
            };
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

const authenticateWithBankId = async (payload) => {
    const response = await axiosClient.post(`${process.env.BANKIDURL}/signAndCollect`, payload);

    // const validatedResponse = await validate(response.data.data.completionData.user, bankidSchema);
    console.log('bankid response', response.data);
    return response.data.data.completionData.user;
};

const getNavetData = async (personalNumber) => {
    const response = await axiosClient.post(process.env.NAVETURL, { id: personalNumber });
    response.data.id = response.data.Folkbokforingspost.Personpost.PersonId.PersonNr;

    // const validResNavet = await validate(response.data, navetSchema);

    return response.data;
};

const validate = (input, schema) => {
    return new Promise((resolve, reject) => {
        try {
            const result = schema.validate(input);
            if (result.error === null) {
                resolve(result);
            } else {
                reject(result.error);
            }
        } catch (error) {
            reject(error);
        }
    });
};

const hget = (id) => {
    return new Promise((resolve, reject) => {
        redisClient.hget('persons', id, (err, reply) => {
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
        redisClient.hmset('persons', id, stringData, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
};

redisClient.on('error', (err) => {
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
