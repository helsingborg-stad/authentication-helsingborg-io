const axios = require('axios');
const Person = require('./personModel');
const https = require('https');
const fs = require('fs');
const parser = require('xml2json');

const url = 'https://www2.test.skatteverket.se/nawa15/na_epersondata/V2/personpost';
const url2 = 'https://localhost:3001/getNavet/test'
const host = 'www2.test.skatteverket.se';
const path = '/nawa15/na_epersondata/V2/personpost';
const port = '443';

const host2 = 'localhost';
const path2 = '/getNavet/test';
const port2 = '3001';
// PersonpostRequest
let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://xmls.skatteverket.se/se/skatteverket/folkbokforing/na/epersondata/V1"> <soapenv:Header/> <soapenv:Body> <v1:PersonpostRequest> <v1:Bestallning> <v1:OrgNr>162021004748</v1:OrgNr> <v1:BestallningsId>00000079-FO01-0008</v1:BestallningsId> </v1:Bestallning> <v1:PersonId>193101189227</v1:PersonId> </v1:PersonpostRequest> </soapenv:Body> </soapenv:Envelope>';

//


const headers2 = {
    'Content-Type': 'text/xml;charset=UTF-8',
    'Content-Length': xml.length
}

const axiosClient = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        key: fs.readFileSync(process.env.komAKey),
        cert: fs.readFileSync(process.env.komACrt),
        passphrase: '8017644482212111',
    }),
    headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Content-Length': xml.length
    },
});

const axiosClient2 = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        cert: fs.readFileSync(process.env.SERVERCERT),
        key: fs.readFileSync(process.env.SERVERKEY)
    }),
    headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Content-Length': xml.length
    },
});

exports.getPerson = async (id) => {
    try {
        const res = await axiosClient.post(url, xml);
        // const resParsed = await parseJson(res.data);
        console.log('wat');
        console.log(res.data);
        
        return(res.data);
    } catch (error) {
        return (error);
    }
};

const parseJson = (xml) => {
    return new Promise((resolve, reject) => {
        try {
            resolve (parser.toJson(xml));
        } catch (error) {
            reject(error);
        }
    })
};
