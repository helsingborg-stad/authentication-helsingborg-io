const pino = require('pino');

const { LOG_LEVEL } = process.env;
module.exports = pino({ level: LOG_LEVEL });
