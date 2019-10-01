const JSONAPISerializer = require('json-api-serializer');
const schemas = require('./schemas');

const Serializer = new JSONAPISerializer({
  convertCase: 'snake_case',
  unconvertCase: 'camelCase',
});

Serializer.register('auth', schemas.auth);
Serializer.register('collect', schemas.collect);
Serializer.register('sign', schemas.sign);
Serializer.register('cancel', schemas.cancel);

module.exports = Serializer;
