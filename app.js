const axios = require('axios').default;


module.exports = class UrlCompleter {
    // URL of coordinator microservice, needs to be set prior to usage
    coordinatorURL;
    // Object containing key:value pairs of service names and addresses
    baseURLs = {};
 
    /**
     * Provide a URL for the coordinator service which will be used when
     * requesting service addresses
     * @param {String} url 
     */   
    constructor(url) {
        this.coordinatorURL = url;
    }

    /**
     * Provide the coordinator service with the service name and URL, implicit
     * in the POST request headers
     * @param {String} serviceName 
     * @returns Promise for either a nothing or return or an error
     */
    registerServiceURL(serviceName) {
        let url = this.coordinatorURL + '/' + serviceName;
        return axios.post(url)
            .then(_ => null)
            .catch(err => err);
    }
    
    /**
     * Retrieve the URL for a service of the given name from the coordinator
     * @param {String} serviceName 
     * @returns Promise for either the service URL as a String or an error
     */
    retrieveServiceURL(serviceName) {
        let url = this.coordinatorURL + '/' + serviceName;
        return axios.get(url)
            .then(res => {
                this.baseURLs[serviceName] = res.data;
                return this.baseURLs[serviceName];
            })
            .catch(_ => {
                return new Error("The service " + serviceName + " is not available.");
            });
    }

    /**
     * Get the URL for a service of a given name from storage if already
     * retrieved successfully, or make a new request to the coordinator.
     * @param {String} serviceName 
     * @returns Promise for either the service URL as a String or an error
     */
    getServiceURL(serviceName) {
        return new Promise((resolve, reject) => {
            if(!this.baseURLs[serviceName]) return this.registerServiceURL(serviceName);
            return this.baseURLs[serviceName];
        })
        .then(_ => resolve(this.baseURLs[serviceName]))
        .catch(err => Promise.reject(err));
    }
}