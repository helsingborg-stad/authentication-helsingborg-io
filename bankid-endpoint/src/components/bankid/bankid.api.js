const express = require('express');
const bankid = require('./bankid.dal');

const routes = () => {
  const router = express.Router();

  router.post('/signAndCollect', async (req, res) => {
    try {
      const { endUserIp, personalNumber, userVisibleData } = req.body;
      const response = await bankid.signAndCollect(endUserIp, personalNumber, userVisibleData);

      return res.json(response);
    } catch (err) {
      console.log('err', err);
      return res.json(err);
    }
  });

  router.post('/auth', async (req, res) => {
    try {
      console.log('auth');
      const { endUserIp } = req.body;

      return res.json(
        await bankid.auth(endUserIp),
      );
    } catch (err) {
      console.log('err', err);
      return res.json(err);
    }
  });

  router.post('/sign', async (req, res) => {
    try {
      const { endUserIp, personalNumber, userVisibleData } = req.body;

      return res.json(
        await bankid.sign(endUserIp, personalNumber, userVisibleData),
      );
    } catch (err) {
      console.log('err', err);
      return res.json(err);
    }
  });

  router.post('/collect', async (req, res) => {
    try {
      const { orderRef } = req.body;

      return res.json(
        await bankid.collect(orderRef),
      );
    } catch (err) {
      console.log('err', err);
      return res.json(err);
    }
  });

  return router;
};
module.exports = routes;
