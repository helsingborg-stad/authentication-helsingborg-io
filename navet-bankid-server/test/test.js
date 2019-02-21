process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './.env.test' });

const chai = require('chai');
const server = require('../app.js');
const should = chai.should();
chai.use(require('chai-http'));

/* eslint-disable no-undef */
describe('Server', function () {
    after(function (done) {
        server.close();
        done();
    });

    it('testing getNavet', function (done) {
        chai.request(server)
            .get('/getNavet')
            .send({
                id: '195003072260'
            })
            .end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.Folkbokforingspost.Personpost.PersonId.PersonNr.should.equal('195003072260');
                console.log(res.status);
                console.log(res.body.Folkbokforingspost.Personpost.PersonId.PersonNr);
                // res.body.status.isSuccess.should.equal(true);
                done();
            });
    });
});
