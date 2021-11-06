const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

module.exports = {
    expectError(res, error) {
        expect(res.status).to.eql(error.status);

        should.exist(res.body);
        should.exist(res.body['Error']);

        expect(res.body['Error']).to.eql(error.message);
    }
}