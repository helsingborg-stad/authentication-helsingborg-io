const Serializer = require('./serializer.jsonapi');
const createObjectFromApiResponse = require('./convert/convert.jsonapi');

module.exports = {
  serializer: Serializer,
  convert: {
    apiResponse: createObjectFromApiResponse,
  },
};
