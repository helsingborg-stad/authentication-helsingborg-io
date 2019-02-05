'use strict';
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const fs = require('fs');
const jwt = require('express-jwt');
const cors = require('cors');

require('body-parser-xml')(bodyParser);

const app = express();

// !!!!!!!!!!!!!!!!!*********** Dont have this in prod
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Allow cors for dev-environment.
app.use(cors());
app.options('*', cors());

app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
});

// Require authorization on all endpoints except those specified under unless.
app.use(
    jwt({ secret: process.env.AUTHSECRET })
        .unless({ path: ['/auth/', '/auth'] }));

// If request is unauthorized, send back error information with 401 status.
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Your authorization token is missing or invalid.');
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.xml({ normalize: true }));

app.get('/', (_req, res) => res.send('Hello World!'));

app.use(require('./components'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = https.createServer({
    cert: fs.readFileSync(process.env.SERVERCERT),
    key: fs.readFileSync(process.env.SERVERKEY),
    requestCert: false,
    rejectUnauthorized: false
}, app).listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));

module.exports = server;
