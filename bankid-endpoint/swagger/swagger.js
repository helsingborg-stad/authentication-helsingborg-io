const { authPath, userSchema,collectPath,cancelPath,signPath } = require('../src/components/bankid/bankid.swagger');
const { definitions } = require('../swagger/global.swagger');

module.exports = {
  swagger: '2.0',
  info: {
    version: '0.0.1',
    title: 'Simple API',
    description: 'Api document to test and document all available API functionality',
  },
  host: 'simple.api',
  paths: {
    '/auth': {
      post: authPath.post,
    },
    '/sign': {
      post: signPath.post,
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
    ...userSchema,
  },
};
