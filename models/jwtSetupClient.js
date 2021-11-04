//https://medium.com/@bryanmanuele/sessionless-authentication-withe-jwts-with-node-express-passport-js-69b059e4b22c
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const path = require('path');
require('dotenv').config(path.resolve('..'))

const errors = require('./errors');

module.exports = function(completer) {
    passport.use(
        new LocalStrategy(function(username, password, done) {
        try {
            //Check with user service that provided username and password match
            completer.serviceRequest("user", "users/" + username,
                "post", null, { password: password })
                .then(user => done(null, user))
                .catch(done(new errors.BadLoginError()))
        } catch (error) {
            return done(error);
        }
    }));
    
    passport.use(
        new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWTSECRET
        },
        async (jwtPayload, done) => {
        if(Date.now() > jwtPayload.exp) {
            return done("JWT is expired");
        } else {
            return done(null, jwtPayload.username);
        }
    }));
};