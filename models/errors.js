/**
 * Adds a given status to a given error
 * @param {Error} error 
 * @param {Number} status 
 * @returns 
 */
function addStatus(error, status) {
    error['status'] = status;
    return error;
}

module.exports = {
    handleErrors: function(err, req, res, next) {
        let status = err.status || 500;
        res.status(status).json({ "Error": err.message });
        next();
    },
    wrapErrorResponse: function(errorResponse) {
        return addStatus(
            new Error(errorResponse.response.data['Error']),
            errorResponse.response.status
        );
    },
    ServiceNotFoundError: class ServiceNotFoundError extends Error {
        constructor() {
            super("Service not found");
            this.name = "ServiceNotFoundError";
            this.status = 404;
        }
    },
    MissingAttributeError: class MissingAttributeError extends Error {
        constructor() {
            super("Request has a missing required attribute");
            this.name = "MissingAttributeError";
            this.status = 400;
        }
    },
    UserNotFoundError: class UserNotFoundError extends Error {
        constructor() {
            super("User not found");
            this.name = "UserNotFoundError";
            this.status = 404;
        }
    },
    UsernameUnavailableError: class UsernameUnavailableError extends Error {
        constructor() {
            super("Requested username already in use");
            this.name = "UsernameUnavailableError";
            this.status = 403;
        }
    },
    UsernameInvalidError: class UsernameInvalidError extends Error {
        constructor() {
            super("Requested username is invalid");
            this.name = "UsernameInvalidError";
            this.status = 400;
        }
    },
    PasswordInvalidError: class PasswordInvalidError extends Error {
        constructor() {
            super("Requested password is invalid");
            this.name = "PasswordInvalidError";
            this.status = 400;
        }
    },
    ReputationInvalidError: class ReputationInvalidError extends Error {
        constructor() {
            super("Requested reputation is invalid");
            this.name = "ReputationInvalidError";
            this.status = 400;
        }
    },
    JwtExpiredError: class JwtExpiredError extends Error {
        constructor() {
            super("JWT is expired");
            this.name = "JwtExpiredError";
            this.status = 401;
        }
    },
    JwtInvalidError: class JwtInvalidError extends Error {
        constructor() {
            super("JWT is invalid");
            this.name = "JwtInvalidError";
            this.status = 401;
        }
    },
    BadLoginError: class BadLoginError extends Error {
        constructor() {
            super("Bad username or password");
            this.name = "BadLoginError";
            this.status = 401;
        }
    }
}