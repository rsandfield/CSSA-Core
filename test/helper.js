const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

module.exports = {
    expectError(res, error) {
        expect(res.status).to.eql(error.status);

        should.exist(res.body);
        should.exist(res.body['Error']);

        expect(res.body['Error']).to.eql(error.message);
    },
    coordinatorConfigured(services) {
        describe('Coordinator configured', function() {
            let completer = app.__get__('completer');
            let invalidService = 'invalid';
        
            it('coordinator module should have coordinator URL from config', function() {
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
        
            services.forEach(service => {
                nock(process.env.coordinatorURL)
                    .persist()
                    .get('/' + service.name)
                    .reply(200, { [service.name]: {
                        'url': service.url,
                        'token': service.token 
                    }}); 
            });
        
            services.forEach(service => {
                it("should get the " + service.name + " service address and access token", async function() {
                    return completer.getServiceDetails(service.name)
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
    compareObjects(expected, testing, keys) {
        keys.forEach(key => {
            expect(testing[key]).to.eql(expected[key]);
        })
    }
}