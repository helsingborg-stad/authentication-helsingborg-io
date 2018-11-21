const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const app = express();
const port = 3000;

// !!!!!!!!!!!!!!!!!*********** Dont have this in prod
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.use(require('./components'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

https.createServer({
    key: fs.readFileSync('../../localConfig/server.key'),
    cert: fs.readFileSync('../../localConfig/server.cert'),
    requestCert: true,
    rejectUnauthorized: false
}, app).listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
