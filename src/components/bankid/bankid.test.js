/* eslint-disable no-unused-expressions */
require('dotenv').config({ path: './.env.test' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

const should = chai.should();
chai.use(chaiHttp);
const API_BASE = '/api/v1';

describe('BankId', () => {
  after(async () => {
    server.close();
  });

  it('should return json on /bankid/auth POST', async () => chai
    .request(server)
    .post(`${API_BASE}/bankid/auth`)
    .send({
      endUserIp: '194.168.2.25',
      personalNumber: '190000000000',
    })
    .then((res) => {
      res.should.have.status(200);
      res.should.be.json;
      should.exist(res.body);
    }));

  it('should return 422 on /bankid/auth POST without endUserIp', async () => chai
    .request(server)
    .post(`${API_BASE}/bankid/auth`)
    .send()
    .then((res) => {
      res.body.should.have.status(400);
      res.should.be.json;
      should.exist(res.body);
      should.exist(res.error);
    }));

  it('should return json on /bankid/sign POST', async () => chai
    .request(server)
    .post(`${API_BASE}/bankid/sign`)
    .send({
      endUserIp: '194.168.2.25',
      personalNumber: '190000000000',
      userVisibleData: 'IFRoaXMgaXMgYSBzYW1wbGUgdGV4dCB0byBiZSBzaWduZWQ=',
    })
    .then((res) => {
      res.should.have.status(200);
      res.should.be.json;
      should.exist(res.body);
    }));

  it('should return 422 on /bankid/sign POST without endUserIp or personalnumber', async () => chai
    .request(server)
    .post(`${API_BASE}/bankid/sign`)
    .send({
      userVisibleData: 'IFRoaXMgaXMgYSBzYW1wbGUgdGV4dCB0byBiZSBzaWduZWQ=',
    })
    .then((res) => {
      res.body.should.have.status(400);
      res.should.be.json;
      should.exist(res.body);
      should.exist(res.error);
    }));
});
