const axios = require('axios');
const Person = require('./personModel');

exports.getPerson2 = (body) => {
    return new Promise((resolve, reject) => {
        let reply = new Person(body.id, 'hej', 'soccerplayer');
        resolve(reply);
        /*
        possible solution
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
            cert: fs.readFileSync("./usercert.pem"),
            key: fs.readFileSync("./key.pem"),
            passphrase: "YYY"
        })
        axios.get(url, { httpsAgent })

        const instance = axios.create({ httpsAgent })

        */
        /*
        axios({
            method: 'post',
            url,
            headers,
            data: xml
        }).then((response) => {
            resolve({
                response: {
                    body: response.data,
                    statusCode: response.status,
                }
            })
        }).catch((error) => {
            reject(error)
        })
        */
    });
};
