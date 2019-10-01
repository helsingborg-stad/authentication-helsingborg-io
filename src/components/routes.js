const express = require('express');
const pjson = require('./../../package.json');
const bankid = require('./bankid/bankid.api');

const routes = () => {
  const router = express.Router();

  router.get('/', async (req, res) => res.json({
    jsonapi: {
      version: '1.0',
      meta: {
        service: pjson.name,
        owner: 'Helsingborg Stad',
        description: pjson.description,
      },
    },
  }));

  // Register route to api-layer.
  router.use('/bankid', bankid());

  return router;
};

module.exports = routes;
