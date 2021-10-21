const chai = require('chai');
chai.use(require('chai-http'));
const nock = require('nock');
const should = chai.should();
const expect = chai.expect;

const rewire = require('rewire');
var app = rewire('../app');
var packageJson = require('../package.json');

describe('Register URLs', function() {
    let coordinatorURL = 'https://localhost:3000';
    let serviceURL = 'https://localhost:3001';
    let goodService = 'test';
    let badService = 'nope';

    it('should set the coordinator url', () => {
      app.registerCoordinatorURL(coordinatorURL);
      expect(app.__get__('coordinatorURL')).to.eql(coordinatorURL);
    });

    it('should provide the coordinator with its name and address', async function() {
      nock(coordinatorURL)
        .post('/' + goodService)
        .reply(201);
      let res = await app.registerServiceURL(goodService);
      should.not.exist(res);
    })
    
    it('should set up a service URL in the tracking JSON for an existing service', async function() {
      nock(coordinatorURL)
        .get('/' + goodService)
        .reply(200, serviceURL);

      app.registerCoordinatorURL(coordinatorURL);
      let res = await app.retrieveServiceURL(goodService);
      res.should.be.eql(serviceURL);
    });

    it('should fail to set up a service URL in the tracking JSON for a non-existant service', async function() {
      let error = new app.ServiceNotFoundError(badService);
      nock(coordinatorURL)
        .get('/' + badService)
        .reply(404, error);

      app.registerCoordinatorURL(coordinatorURL);
      let res = await app.retrieveServiceURL(badService);
      res.message.should.eql(error.message);
  });
});