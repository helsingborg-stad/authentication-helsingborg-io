const express = require('express');
const config = require('config');
const https = require('https');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const swaggerDocument = require('../swagger/swagger.js');
const routes = require('./components/routes');


/**
 * Config
 */
const SERVER_PORT = process.env.PORT || config.get('SERVER.PORT');
const CERT = config.get('SERVER.CERT');
const KEY = config.get('SERVER.KEY');

const httpsOptions = {
  cert: fs.readFileSync(CERT),
  key: fs.readFileSync(KEY),
  requestCert: true,
  rejectUnauthorized: false
};

/**
 * Init App
 */
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add routes to the app.
app.get('/', (req, res) => res.send('Welcome to bankid Api!'));
app.use(routes());

// Swagger for documenting the api, access through localhost:xxxx/api-docs.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Start
 */

const server = https.createServer(httpsOptions, app)
server.listen(SERVER_PORT, () => console.log(`Bank api listening on port ${SERVER_PORT}!`));

module.exports = server;
