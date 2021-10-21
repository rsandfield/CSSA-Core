const axios = require('axios').default;

// URL of coordinator microservice, needs to be set prior to usage
var coordinatorURL;
// Object containing key:value pairs of service names and addresses
var baseURLs = {};

module.exports = {
    /**
     * Provide a URL for the coordinator service which will be used when
     * requesting service addresses
     * @param {String} url 
     */
    registerCoordinatorURL: function(url) {
        coordinatorURL = url;
    },
    /**
     * Provide the coordinator service with the service name and URL, implicit
     * in the POST request headers
     * @param {String} serviceName 
     * @returns Promise for either a nothing or return or an error
     */
    registerServiceURL: function(serviceName) {
        let url = coordinatorURL + '/' + serviceName;
        return axios.post(url)
            .then(_ => null)
            .catch(err => err);
    },
    /**
     * Retrieve the URL for a service of the given name from the coordinator
     * @param {String} serviceName 
     * @returns Promise for either the service URL as a String or an error
     */
    retrieveServiceURL: function(serviceName) {
        let url = coordinatorURL + '/' + serviceName;
        return axios.get(url)
            .then(res => {
                baseURLs[serviceName] = res.data;
                return baseURLs[serviceName];
            })
            .catch(_ => {
                return new this.ServiceNotFoundError(serviceName);
            });
    },
    /**
     * Retrieve the URL for a service of a given name from storage if already
     * retrieved successfully, or make a new request to the coordinator.
     * @param {String} serviceName 
     * @returns Promise for either the service URL as a String or an error
     */
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