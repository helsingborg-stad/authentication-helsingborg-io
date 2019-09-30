const addIdToApiResponse = (data) => {
    data.id = +new Date();
    return data;
};

module.exports = addIdToApiResponse;
