
const expect = require('chai').expect;
const request = require('request');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const url = 'https://localhost:3001/';

it('Main page status', (done) => {
    request('https://localhost:3001/' ,(error, response, body) => {
        console.log(response.statusCode);
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('getNavet works', (done) => {
    request('https://localhost:3001/getNavet', {body:JSON.stringify({object})} ,(error, response, body) => {
        console.log('################################')
        console.log(response.statusCode);
        console.log('################################')
        console.log(response.body);
        console.log('################################')
        expect(response.statusCode).to.equal(200);
        expect(test.throwFunction()).to.be.an.instanceOf(Error).with.property('message', 'This is an error message')
        done();
    });
});
/*
it('getNavet fails', (done) => {
    request('https://localhost:3001/getNavet', {id: '199104239844'} ,(error, response, body) => {
        console.log(response.statusCode);
        console.log(response.body);
        expect(response.statusCode).to.equal(200);
        expect(test.throwFunction()).to.be.an.instanceOf(Error).with.property('message', 'This is an error message')
        done();
    });
});
*/