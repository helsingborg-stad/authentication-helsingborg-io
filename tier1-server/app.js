'use strict';
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const fs = require('fs');
require('body-parser-xml')(bodyParser);

const app = express();

// !!!!!!!!!!!!!!!!!*********** Dont have this in prod
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.xml({ normalize: true }));

app.get('/', (req, res) => res.send('Hello World!'));
app.use(require('./components'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = https.createServer({
    cert: fs.readFileSync(process.env.SERVERCERT),
    key: fs.readFileSync(process.env.SERVERKEY),
    requestCert: true,
    rejectUnauthorized: false
}, app).listen(process.env.PORT, () => console.log(`Example app listening on port 3000!`));

module.exports = server;
