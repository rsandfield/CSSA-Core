const chai = require('chai');
chai.use(require('chai-http'));
const nock = require('nock');
const should = chai.should();
const expect = chai.expect;

var app = require('../app');

describe('Register URLs', function() {
    let coordinatorURL = 'https://localhost:3000';
    let serviceURL = 'https://localhost:3001';
    let goodService = 'test';
    let badService = 'nope';
    let completer = new app(coordinatorURL);

    it('should set the coordinator url', () => {
      expect(completer.coordinatorURL).to.eql(coordinatorURL);
    });

    it('should provide the coordinator with its name and address', async function() {
      nock(coordinatorURL)
        .post('/' + goodService)
        .reply(201);
      let res = await completer.registerServiceURL(goodService);
      should.not.exist(res);
    })
    
    it('should set up a service URL in the tracking JSON for an existing service', async function() {
      nock(coordinatorURL)
        .get('/' + goodService)
        .reply(200, serviceURL);

      let res = await completer.retrieveServiceURL(goodService);
      res.should.be.eql(serviceURL);
    });

    it('should fail to set up a service URL in the tracking JSON for a non-existant service', async function() {
      let error = new Error("The service " + badService + " is not available.");
      nock(coordinatorURL)
        .get('/' + badService)
        .reply(404, error);

      let res = await completer.retrieveServiceURL(badService);
      res.message.should.eql(error.message);
  });
});