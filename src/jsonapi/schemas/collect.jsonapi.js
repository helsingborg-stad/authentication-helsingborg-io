const { BASE_URL } = process.env;
const collectJsonApiSchema = {
  id: 'orderRef',
  blacklist: [],
  topLevelLinks: {
    self: `${BASE_URL}/collect`,
  },
};

module.exports = collectJsonApiSchema;
