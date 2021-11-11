require('dotenv').config();

module.exports = {
    UrlCompleter: require('./models/urlCompleter'),
    errors: require('./models/errors'),
    ...(process.env.dev) && {testHelper: require('./test/helper')},
    authClientFacing: require('./models/authClientFacing'),
    authServerFacing: require('./models/authServerFacing'),
}