const axios = require('axios').default;
const errors = require('./errors');

require('dotenv').config();

module.exports = class UrlCompleter {
    // URL of coordinator microservice, needs to be set prior to usage
    coordinatorURL;
    // Object containing key:value pairs of service names and addresses
    services = {};
 
    /**
     * Provide a URL for the coordinator service which will be used when
     * requesting service addresses
     * @param {String} url 
     */   
    constructor(url) {
        this.coordinatorURL = url;
    }
    
    /**
     * Retrieve the details for a service of the given name from the coordinator
     * @param {String} serviceName 
     * @returns Promise for either the service details or an error
     */
    async retrieveServiceDetails(serviceName) {
        return axios({
            baseURL: this.coordinatorURL,
            url: '/' + serviceName,
            method: 'get',
            headers: {
                Authorization: process.env.coordinatorSecret
            }
        })
            .then(res => {
                this.services[serviceName] = res.data[serviceName];
                return Promise.resolve(this.services[serviceName]);
            })
            .catch(_ => {
                return Promise.reject(new errors.ServiceNotFoundError());
            });
    }

    /**
     * Get the details for a service of a given name from storage if already
     * retrieved successfully, or make a new request to the coordinator.
     * @param {String} serviceName 
     * @returns Promise for either the service details or an error
     */
    async getServiceDetails(serviceName) {
        if(this.services[serviceName]) {
            return Promise.resolve(this.services[serviceName]);
        }
        return this.retrieveServiceDetails(serviceName);
    }

    /**
     * Takes provided parts of an HTTP request and assembles them into one
     * targeted at the correct service, either returning the response or error
     * wrapped into a usable form
     * @param {String} serviceName 
     * @param {String} routeBase 
     * @param {String} method 
     * @param {any} data 
     * @returns Promise for either the expected response or an error
     */
    async serviceRequest(serviceName, routeBase, routeExtended, method, data) {
        if(routeExtended) {
            if(routeExtended[0] != '/') routeBase += '/';
            routeBase += routeExtended;
        }
        return this.getServiceDetails(serviceName)
            .then(service => axios({
                baseURL: service.url,
                url: routeBase,
                method: method,
                headers: {
                    Accept: 'application/json',
                    Authorization: service.token
                },
                ...(data) && {data: data}
            }))
            .then(response => Promise.resolve(response.data))
            .catch(error => {
                if(error.response) {
                    return Promise.reject(errors.wrapErrorResponse(error));
                } else {
                    return Promise.reject(error);
                }
            })
    }

    async userServiceRequest(url, method, data) {
        return this.serviceRequest('user', 'users', url, method, data);
    }

    async storeServiceRequest(url, method, data) {
        return this.serviceRequest('store', 'stores', url, method, data);
    }

    async reviewServiceRequest(url, method, data) {
        return this.serviceRequest('review', 'reviews', url, method, data);
    }

    async tagServiceRequest(url, baseUrl, method, data) {
        return this.serviceRequest('tag', baseUrl, url, method, data);
    }

    async itemServiceRequest(url, method, data) {
        return this.serviceRequest('item', 'items', url, method, data);
    }

    async priceServiceRequest(url, method, data) {
        return this.serviceRequest('price', 'prices', url, method, data);
    }
}