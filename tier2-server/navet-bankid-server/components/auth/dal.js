const redis = require('redis');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const navetSchema = require('./validation/navetSchema');
const bankidSchema = require('./validation/bankidSchema');
const redisClient = redis.createClient();

exports.authenticate = async (request) => {
    try {
        console.log(request);
        const { personalNumber, endUserIp, userVisibleData } = request;

        // Authenticate against bankid.
        const bankIdUserData = await bypassBankid({ // authenticateWithBankId
            // personalNumber,
            personalNumber: '198404293279',
            endUserIp,
            userVisibleData
        });

        // If auth was successful there is userdata in the response.
        if (bankIdUserData) {
            let navetData = null;
            // Check for cached data about the user from Navet.
            // const cachedUserData = await hget(personalNumber);
            const cachedUserData = null;

            if (cachedUserData) {
                console.log('cached', cachedUserData);
                navetData = Object.assign({}, ...cachedUserData);
            } else {
                // If there is no cached data we fetch it again from Navet
                navetData = await bypassNavetData(personalNumber); // getNavetData
                // await hset(personalNumber, JSON.stringify(navetData));
            }

            return {
                // Combine Bankid and Navet data.
                user: {
                    personalNumber: bankIdUserData.personalNumber,
                    name: bankIdUserData.name,
                    givenName: bankIdUserData.givenName,
                    surname: bankIdUserData.surname,
                    navet: navetData
                }
            };
        }

        return null;
    } catch (error) {
        console.log(error);
        return error;
    }
};

const authenticateWithBankId = async (payload) => {
    console.log('payload', payload);
    const response = await axiosClient.post(`${process.env.BANKIDURL}/signAndCollect`, payload);

    console.log('bankid response', response.data);
    return response.data.data.completionData.user;
};

const bypassBankid = async (payload) => {
    return {
        'name': 'Tom Andreasson',
        'givenName': 'Tom',
        'surname': 'Andreasson',
        'personalNumber': '198404293279'
    };
};

const bypassNavetData = async (payload) => {
    return {
        'address': 'Drottninggatan 2',
        'zipCode': 11120,
        'city': 'Stockholm'
    };
};

const getNavetData = async (personalNumber) => {
    const response = await axiosClient.post(process.env.NAVETURL, { id: personalNumber });
    response.data.id = response.data.Folkbokforingspost.Personpost.PersonId.PersonNr;
    return response.data;
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
