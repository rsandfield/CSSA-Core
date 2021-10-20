const axios = require('axios').default;

var baseURLs = {};
var coordinatorURL;

module.exports = {
    registerCoordinatorURL: function(url) {
        coordinatorURL = url;
    },
    registerServiceURL: function(serviceName) {
        let url = coordinatorURL + '/' + serviceName;
        return axios.get(url)
            .then(res => {
                baseURLs[serviceName] = res.data;
                return baseURLs[serviceName];
            })
            .catch(err => {
                return new this.ServiceNotFoundError(serviceName);
            });
    },
    getServiceURL: function(serviceName) {
        return new Promise((resolve, reject) => {
            if(!baseURLs[serviceName]) return registerServiceURL(serviceName);
            return baseURLs[serviceName];
        })
        .then(_ => resolve(baseURLs[serviceName]))
        .catch(err => reject(err));
    },
    ServiceNotFoundError: class ServiceNotFoundError extends Error {
        constructor(serviceName) {
            super("The service " + serviceName + " is not available.");
            this.name = "ServiceNotFoundError";
        }
    }
}