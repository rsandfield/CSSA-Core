require('dotenv').config();

module.exports = {
    UrlCompleter: require('./models/urlCompleter'),
    errors: require('./models/errors'),
    authClientFacing: require('./models/authClientFacing'),
    authServerFacing: require('./models/authServerFacing'),
    testHelper: require('./test/helper'),
    dummyValues: require('./models/dummyValues')
}