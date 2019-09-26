const createObjectFromApiResponse = (data) => {
  const response = data.data;
  response.id = +new Date();

  return response;
};

module.exports = createObjectFromApiResponse;
