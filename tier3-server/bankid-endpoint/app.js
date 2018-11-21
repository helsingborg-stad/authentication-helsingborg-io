const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
var fs = require('fs');

const app = express();

// !!!!!!!!!!!!!!!!!*********** Dont have this in prod
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.use(require('./components'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log(process.env.SERVERKEY);
console.log(process.env.SERVERCERT);

https.createServer({
    key: fs.readFileSync(process.env.SERVERKEY),
    cert: fs.readFileSync(process.env.SERVERCERT),
    requestCert: false,
    rejectUnauthorized: false
}, app).listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
