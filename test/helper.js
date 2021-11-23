const chai = require('chai');
chai.use(require('chai-http'));
const should = chai.should();
const expect = chai.expect;

const errors = require('../models/errors');

require('dotenv').config()


module.exports = {
    /**
     * Compares the error contained by the response to the error that was
     * expected, including HTML response status
     * @param {HTML Response} res 
     * @param {Error} error 
     */
    expectError(res, error) {
        // Check status, defaulting to 500 if none provided
        if(!error.status) expect(res.status).to.eql(500);
        expect(res.status).to.eql(error.status);

        should.exist(res.body);
        should.exist(res.body['Error']);

        expect(res.body['Error']).to.eql(error.message);
    },
    /**
     * Test the 'about' route for correctly extracting package information
     * @param {Express} app 
     * @param {JSON} packageJson 
     */
    aboutTest(app, packageJson) {
        describe('/GET about', function() {
            it('should return project name and version', (done) => {
                this.timeout(3000);
        
                chai.request(app)
                    .get('/about')
                    .then(res => {
                        res.should.have.status(200);
        
                        let body = res.body;
                        
                        body.should.be.a('object');
                        
                        Object.keys(body).length.should.be.eql(2);
                        
                        body['name'].should.be.eql(packageJson.name);
                        body['version'].should.be.eql(packageJson.version);
                        done();
                    });
            });
        });
    },
    /**
     * Populate the app's UrlCompleter with nock service addresses and test that
     * everything is reading correctly
     * @param {UrlCompleter} completer 
     * @param {Array} services 
     */
    configureAndTestCompleter(nock, completer, services) {
        describe('Coordinator configured', function() {
            let invalidService = 'invalid';
        
            it('should have coordinator URL from config', function() {
                expect(completer.coordinatorURL).to.eql(process.env.coordinatorURL);
            });
        
            it('should get an error for requesting an unregistered service', async function() {
                let error = new errors.ServiceNotFoundError();
        
                nock(process.env.coordinatorURL)
                    .get('/' + invalidService)
                    .reply(404, error);
        
                return completer.getServiceDetails(invalidService)
                    .then(res => should.not.exist(res))
                    .catch(err => err.message.should.eql(error.message));
                
            });
        
            // Populate nock routes
            services.forEach(service => {
                nock(process.env.coordinatorURL)
                    .persist()
                    .get('/' + service.name)
                    .reply(200, { [service.name]: {
                        'url': service.url,
                        'token': service.token 
                    }}); 
            });
        
            // Test that services were registered correctly
            services.forEach(service => {
                it("should get the " + service['name'] + " service address and access token", async function() {
                    return completer.getServiceDetails(service['name'])
                        .then(res => {              
                            should.exist(res.url);
                            should.exist(res.token);
        
                            expect(res.url).to.eql(service.url);
                            expect(res.token).to.eql(service.token);
                        });
                });
            });
        });
    },
    /**
     * Run a comparison between two objects, limited to the given keys
     * @param {Object} expected 
     * @param {Object} testing 
     * @param {Keys} keys 
     */
    compareObjects(expected, testing, keys) {
        if(!keys) keys = Object.keys(expected);
        keys.forEach(key => {
            expect(testing[key]).to.eql(expected[key]);
        })
    },
}