const express = require('express');

const bankid = require('./bankid/bankid.api');

const routes = () => {
  const router = express.Router();

  // Register route to api-layer.
  router.use('/bankid', bankid());

  return router;
};

module.exports = routes;
