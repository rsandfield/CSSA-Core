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
        .reply(204);
      
      return completer.registerServiceURL(goodService)
        .then(res => {
          should.not.exist(res);
        });
    })
    
    it('should set up a service URL in the tracking JSON for an existing service', async function() {
      nock(coordinatorURL)
        .get('/' + goodService)
        .reply(200, serviceURL);

      return completer.retrieveServiceURL(goodService)
        .then(res => res.should.be.eql(serviceURL));
    });

    it('should fail to set up a service URL in the tracking JSON for a non-existant service', async function() {
      let error = new Error("The service " + badService + " is not available.");
      nock(coordinatorURL)
        .get('/' + badService)
        .reply(404, error);

      return completer.retrieveServiceURL(badService)
        .then(res => should.not.exist(res))
        .catch(err => {
          should.exist(err)
          err.message.should.eql(error.message);
        });
  });

  describe("Get URLs", function() {
    it('should return an existing service', async function() {
      let service = "exists"
      let url = "exists.com"

      completer.baseURLs[service] = url;
      return completer.getServiceURL(service)
        .then(serviceURL => expect(serviceURL).to.eql("url"))
        .catch(err => should.exist(err))
    });

    it('should throw an error on a nonexisting service', async function() {
      let badservice = "unexists"
      let url = "unexists.com"
      
      return completer.getServiceURL(badservice)
        .then(serviceURL => should.not.exist(serviceURL))
        .catch(err => should.exist(err))
    }); 
  });
});