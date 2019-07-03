const {
  authPath, responsesSchema,
  collectPath, cancelPath, signPath,
  signAndCollectPath, authAndCollectPath,
} = require('../src/components/bankid/bankid.swagger');
const { definitions } = require('../swagger/global.swagger');

module.exports = {
  swagger: '2.0',
  info: {
    version: '0.0.1',
    title: 'Simple API',
    description: 'Api document to test and document all available API functionality',
  },
  host: 'localhost:3004',
  basePath: '/api/v1/bankid',
  paths: {
    '/auth': {
      post: authPath.post,
    },
    '/authAndCollect': {
      post: authAndCollectPath.post,
    },
    '/sign': {
      post: signPath.post,
    },
    '/signAndCollect': {
      post: signAndCollectPath.post,
    },
    '/cancel': {
      post: cancelPath.post,
    },
    '/collect': {
      post: collectPath.post,
    },
  },
  definitions: {
    ...definitions,
    ...responsesSchema,
  },
};
