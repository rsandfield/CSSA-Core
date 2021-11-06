const chai = require('chai');
chai.use(require('chai-http'));
const nock = require('nock');
const should = chai.should();
const expect = chai.expect;

const expectError = require('./helper').expectError;
const errors = require('../models/errors');

const UrlCompleter = require('../models/urlCompleter');

var app = require('../app');

  describe("UrlCompleter", function() {
    coordinatorURL ="http://coordinator.com"
    let completer = new UrlCompleter(coordinatorURL);

    let serviceName = "test"
    let serviceUrl = "http://test.com"
    let token = "placeholder";

    let badservice = "invalid";


    it('should return an existing service', async function() {
      nock(coordinatorURL)
        .persist()
        .get('/' + serviceName)
        .reply(200, {
            [serviceName]: {
              url: serviceUrl,
              token: token
            }
        });

      return completer.getServiceDetails(serviceName)
        .then(response => {
          should.exist(response);

          should.exist(response.url);
          should.exist(response.token);

          expect(response.url).to.eql(serviceUrl);
          expect(response.token).to.eql(token);
        });
    });

    it('should throw an error on a nonexisting service', async function() {
      nock(coordinatorURL)
        .persist()
        .get('/' + badservice)
        .reply(404, { "Error": errors.ServiceNotFoundError.message });
      
      return completer.getServiceDetails(badservice)
        .catch(err => {
          should.exist(err);
          err.should.be.instanceOf(errors.ServiceNotFoundError)
        })
    });

    it('should get data from a remote service', async function() {
      let response = "test text";

      nock(serviceUrl)
        .get('/test')
        .reply(200, response);
      
      return completer.serviceRequest(serviceName, 'test', null, 'get', null)
        .then(res => {
          should.exist(res);

          res.should.eql(response);
        });
    });

    it('should return an error for a bad request to a remote service', async function() {
      let error = new errors.UserNotFoundError();

      nock(serviceUrl)
        .get('/test')
        .reply(error.status, { "Error": error.message });
      
      return completer.serviceRequest(serviceName, 'test', null, 'get', null)
        .catch(err => {
          should.exist(err);
          
          err.should.be.instanceOf(Error);
          err.message.should.eql(error.message)
        });
    });

    it('should return an error for a request to a nonexisting service', async function() {
      let error = new errors.ServiceNotFoundError();
      
      return completer.serviceRequest(badservice, 'test', 'get', null, null)
        .catch(err => {
          should.exist(err);
          
          err.should.be.instanceOf(Error);
          err.message.should.eql(error.message)
        });
    });
});