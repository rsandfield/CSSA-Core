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

//https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

class NotFoundError extends Error {
    constructor(notFound) {
        super(`${notFound} not found`);
        this.name = notFound.camelize + "NotFoundError";
        this.status = 404;
    }
}

class UnavailableError extends Error {
    constructor(unavailable) {
        super(`Requested ${unavailable.toLowerCase()} already in use`);
        this.name = `${unavailable.camelize}UnavailableError`;
        this.status = 403;
    }
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
    /**
     * 404 Not Found
     */
    ProductNotFoundError: class ProductNotFoundError extends NotFoundError {
        constructor() {
            super("Product");
        }
    },
    ProductDoesNotHaveTagError: class ProductDoesNotHaveTagError extends Error {
        constructor() {
            super("That product does not have that tag");
            this.name = "ProductDoesNotHaveTagError";
            this.status = 404;
        }
    },
    ListNotFoundError: class ListNotFoundError extends NotFoundError {
        constructor() {
            super("List");
        }
    },
    ListEntryNotFoundError: class ListEntryNotFoundError extends NotFoundError {
        constructor() {
            super("List entry");
        }
    },
    PriceNotFoundError: class PriceNotFoundError extends NotFoundError {
        constructor() {
            super("Price");
        }
    },
    ReviewNotFoundError: class ReviewNotFoundError extends NotFoundError {
        constructor() {
            super("Review");
        }
    },
    ServiceNotFoundError: class ServiceNotFoundError extends NotFoundError {
        constructor() {
            super("Service");
        }
    },
    StoreNotFoundError: class StoreNotFoundError extends NotFoundError {
        constructor() {
            super("Store");
        }
    },
    TagNotFoundError: class TagNotFoundError extends NotFoundError {
        constructor() {
            super("Tag");
        }
    },
    UserNotFoundError: class UserNotFoundError extends NotFoundError {
        constructor() {
            super("User");
        }
    },
    /**
     * User Validation
     */
    MissingAttributeError: class MissingAttributeError extends Error {
        constructor() {
            super("Request has a missing required attribute");
            this.name = "MissingAttributeError";
            this.status = 400;
        }
    },
    UsernameUnavailableError: class UsernameUnavailableError extends UnavailableError {
        constructor() {
            super("Username");
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
    /**
     * Product validation
     */
    ProductIdUnavailableError: class ProductIdUnavailableError extends UnavailableError {
        constructor() {
            super("Product ID");
        }
    },
    /**
     * Authentication errors
     */
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