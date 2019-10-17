const express = require('express');
const config = require('config');
const pino = require('express-pino-logger');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const swaggerDocument = require('../swagger/swagger.js');
const routes = require('./components/routes');
const logger = require('./utils/logger');


// Config
const SERVER_PORT = process.env.PORT || config.get('SERVER.PORT');
const API_BASE = '/api/v1';


// Init App
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Request logging
app.use(pino({ logger }));

// Add routes to the app.
app.get(`${API_BASE}/`, (req, res) => res.send('Welcome to bankid Api!'));
app.use(API_BASE, routes());

// Swagger for documenting the api, access through localhost:xxxx/api/v1/api-docs.
app.use(`${API_BASE}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start
const server = app.listen(SERVER_PORT, () => logger.info(`Bank api listening on port ${SERVER_PORT}!`));

// Export server to use it in tests.
module.exports = server;
