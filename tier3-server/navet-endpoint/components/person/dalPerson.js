const axios = require('axios');
const https = require('https');
const fs = require('fs');
const parser = require('xml2json');

const url = 'https://www2.test.skatteverket.se/nawa15/na_epersondata/V2/personpostXML';

const axiosClient = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        key: fs.readFileSync(process.env.komAKey),
        cert: fs.readFileSync(process.env.komACrt),
        passphrase: process.env.passphrase,
    }),
    headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
    },
});

exports.getPerson = async (id) => {
    let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://xmls.skatteverket.se/se/skatteverket/folkbokforing/na/epersondata/V1"> <soapenv:Header/> <soapenv:Body> <v1:PersonpostRequest> <v1:Bestallning> <v1:OrgNr>162021004748</v1:OrgNr> <v1:BestallningsId>00000079-FO01-0008</v1:BestallningsId> </v1:Bestallning> <v1:PersonId>${id.id}</v1:PersonId> </v1:PersonpostRequest> </soapenv:Body> </soapenv:Envelope>`;
    try {
        const res = await axiosClient.post(url, xml);
        if(res.data) {
            const resParsed = await parseJSON(res.data);
            return(resParsed);
        } else {
            return ('data is empty')
        }
    } catch (error) {
        const errorParsed = await parseJSONError(error.response.data);
        return errorParsed;
    }
};

const parseJSON = (input) => {
    return new Promise((resolve, reject) => {
        try {
            const parsedOnce = input.split('Folkbokforingsposter>');
            const parsedTwice = parsedOnce[1].split('</ns2:');
            const resParsed = parser.toJson(parsedTwice[0]);
            resolve(resParsed);
        } catch (error) {
            reject(error);
        }
    })
};

const parseJSONError = (input) => {
    return new Promise((resolve, reject) => {
        try {
            const parsedOnce = input.split('<faultstring>');
            const parsedTwice = parsedOnce[1].split('</faultstring>');
            resolve(parsedTwice[0]);
        } catch (error) {
            reject(error);
        }
    })
};