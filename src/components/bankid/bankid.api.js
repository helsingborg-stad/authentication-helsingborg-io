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
  router.post('/auth', async (req, res) => bankid.create.auth(req, res));
  router.post('/sign', async (req, res) => bankid.create.sign(req, res));
  router.post('/collect', async (req, res) => bankid.read.order(req, res));
  router.delete('/cancel', async (req, res) => bankid.del.order(req, res));

  return router;
};
module.exports = routes;
