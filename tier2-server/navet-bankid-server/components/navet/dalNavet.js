const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
    console.log('Error ' + err);
});

const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');

exports.getPerson = (body) => {
    return new Promise((resolve, reject) => {
        if (body.id) {
            client.hget('persons', body.id, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    if (!reply) {
                        return fetchAndSavePerson(body, resolve, reject);
                    } else {
                        resolve(JSON.parse(reply));
                    }
                }
            });
        } else {
            // insert error handling
            // reject();
        }
    });
};

function fetchAndSavePerson (body, resolve, reject) {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
        key: fs.readFileSync(path.join(__dirname, '../../server.key'), 'utf8'),
        cert: fs.readFileSync(path.join(__dirname, '../../server.cert'), 'utf8')
    });
    axios({
        method: 'get',
        url: 'https://localhost:3000/getPerson',
        data: body
    }, { httpsAgent }).then((response) => {
        let data = response.data;
        return savePerson(data, resolve, reject);
    }).catch((error) => {
        reject(error);
    });
}

function savePerson (data, resolve, reject) {
    let stringData = JSON.stringify(data);
    client.hmset('persons', data.id, stringData, (err, reply) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    });
}
