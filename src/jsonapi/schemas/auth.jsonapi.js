const { BASE_URL } = process.env;
const authJsonApiSchema = {
  id: 'id',
  blacklist: [],
  topLevelLinks: {
    self: `${BASE_URL}/auth`,
  },
};

module.exports = authJsonApiSchema;
