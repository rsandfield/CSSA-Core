const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

module.exports = {
    expectError(res, error) {
        res.should.have.status(error.status);

        should.exist(res.body);
        should.exist(res.body['Error']);

        expect(res.body['Error']).to.eql(error.message);
    }
}