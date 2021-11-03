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
    /*
    async registerServiceURL(serviceName, port) {
        port = {port: port}
        console.log(port);
        return axios.post(this.coordinatorURL + '/' + serviceName, "port")
            .then(_ => {
                console.log("Service " + serviceName + " registered with coordinator");
                console.log(_.request.headers);
                console.log(_.request.body);
                console.log(_.request.data);
                return Promise.resolve();
            })
    }
    */
    
    /**
     * Retrieve the URL for a service of the given name from the coordinator
     * @param {String} serviceName 
     * @returns Promise for either the service URL as a String or an error
     */
    async retrieveServiceURL(serviceName) {
        return axios({
            baseURL: this.coordinatorURL,
            url: '/' + serviceName,
            method: 'get'
        })
            .then(res => {
                this.baseURLs[serviceName] = res.data[serviceName];
                return Promise.resolve(this.baseURLs[serviceName]);
            })
            .catch(_ => {
                return Promise.reject(new Error("The " + serviceName + " service is not available."));
            });
    }

    /**
     * Get the URL for a service of a given name from storage if already
     * retrieved successfully, or make a new request to the coordinator.
     * @param {String} serviceName 
     * @returns Promise for either the service URL as a String or an error
     */
    async getServiceURL(serviceName) {
        if(this.baseURLs[serviceName]) {
            return Promise.resolve(this.baseURLs[serviceName]);
        }
        return this.retrieveServiceURL(serviceName);
    }
}