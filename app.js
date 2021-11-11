require('dotenv').config();

module.exports = {
    UrlCompleter: require('./models/urlCompleter'),
    errors: require('./models/errors'),
    testHelper: require('./test/helper'),
    ...(process.env.dev) && {authClientFacing: require('./models/authClientFacing')},
    authServerFacing: require('./models/authServerFacing'),
}