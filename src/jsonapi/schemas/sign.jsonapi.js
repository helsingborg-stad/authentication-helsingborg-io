const { BASE_URL } = process.env;
const signJsonApiSchema = {
  id: 'orderRef',
  blacklist: [],
  topLevelLinks: {
    self: `${BASE_URL}/sign`,
  },
};

module.exports = signJsonApiSchema;
