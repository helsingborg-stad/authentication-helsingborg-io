const express = require('express');
const bankid = require('./bankid.dal');
const pjson = require('../../../package.json');

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

  router.post('/auth', async (req, res) => {
    const response = await bankid.create.auth(req, res);
    return res.json(response);
  });

  router.post('/sign', async (req, res) => {
    const response = await bankid.create.sign(req, res);
    return res.json(response);
  });

  router.post('/collect', async (req, res) => {
    const response = await bankid.read.order(req, res);
    return res.json(response);
  });

  router.delete('/cancel', async (req, res) => {
    const response = await bankid.del.order(req, res);
    return res.json(response);
  });

  return router;
};
module.exports = routes;
