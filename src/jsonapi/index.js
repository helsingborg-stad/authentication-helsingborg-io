const Serializer = require('./serializer.jsonapi');
const addIdToApiResponse = require('./convert/convert.jsonapi');

module.exports = {
  serializer: Serializer,
  convert: {
    createId: addIdToApiResponse,
  },
};
