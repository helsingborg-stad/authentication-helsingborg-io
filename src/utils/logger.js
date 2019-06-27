const pino = require('pino');
const config = require('config');

const LOG_LEVEL = config.get('LOG.LEVEL');

module.exports = pino({ level: LOG_LEVEL });
