 /**
  * Generates a new HttpService Object
  * @module HttpService
  * @typedef {function}
  * @returns {{ subscribe: function, get: function, post: function, getQueryParam: function }} HttpService Object
  */
 export function HttpService() {
     const service = {};
     const defaultContentType = 'application/json;charset=UTF-8';
     let subscriptions = [];

     initialize();

     return service;

     function initialize() {
         /**
          * @memberof HttpService 
          * @name subscriptions
          * @type {function[]}
          * @description Gets an array of subscriber callbacks.
          * @instance
          */
         Object.defineProperty(service, 'subscriptions', {
             get() {
                 return subscriptions;
             }
         });

         // services
         service.subscribe = subscribe;
         service.get = get;
         service.post = post;
         service.getQueryParam = getQueryParam;
     }

     /**
      * @memberof HttpService 
      * @type {Function}
      * @property {function} callback function to be called on event.
      * @description Subscribes to the HttpService. An EventData object will be passed into the provided callback when a monitored event occurs.
      * @instance
      */
     function subscribe(callback) {
         if (typeof callback != 'function') throw 'Invalid callback.';
         subscriptions.push(callback);
     }

     /**
      * @memberof HttpService 
      * @type {Function}
      * @param {string} url Request URL.
      * @description Passes a basic GET request to the provided URL, and returns its response.
      * @instance
      */
     function get(url) {
         return new Promise((resolve, reject) => {
             const req = new XMLHttpRequest();
             req.open('GET', url);
             req.onload = () => handleResult(req, resolve, reject);
             req.onerror = () => reject(Error("Network Error"));
             req.send();
         });
     }

     /**
      * @memberof HttpService 
      * @type {Function}
      * @param {string} url Request URL.
      * @param {Object} data Data to be passed.
      * @param {string} contentType ContentType to be used in the request header.
      * @description Makes a basic POST request to the provided URL, and returns its response.
      * @instance
      */
     function post(url, data, contentType = defaultContentType) {
         return new Promise((resolve, reject) => {
             const req = new XMLHttpRequest();
             req.open('GET', url);
             req.onload = () => handleResult(req, resolve, reject);
             req.onerror = () => reject(Error("Network Error"));
             req.send();
         });
     }

     /**
      * @memberof HttpService 
      * @type {Function}
      * @param {string} paramName Query String Parameter to search for.
      * @param {string} url URL to search. If one is not provided, window.location will be used by default.
      * @description Searches a URL for the requested Parameter. If found its value is returned.
      * @returns {string} Query String Parameter Value or undefined object.
      * @instance
      */
     function getQueryParam(variable, url = null) {
         let query = (url) ? url.split('?')[1] : window.location.search.substring(1);
         let vars = query.split('&');
         for (let i = 0; i < vars.length; i++) {
             let pair = vars[i].split('=');
             if (decodeURIComponent(pair[0]) == variable) {
                 return decodeURIComponent(pair[1]);
             }
         }
         return undefined;
     }

     function handleResult(req, resolve, reject) {
         if (req.status == 200) {
             try {
                 const response = JSON.parse(req.response);
                 subscriptions.forEach(callback => callback({
                     type: 'Success',
                     data: response
                 }));
                 resolve(JSON.parse(req.response));
             } catch (error) {
                 subscriptions.forEach(callback => callback({
                     type: 'Success',
                     data: req.response
                 }));
                 resolve(req.response);
             }
         } else {
             subscriptions.forEach(callback => callback({
                 type: 'Error',
                 data: req.response
             }));

             reject({
                 status: req.status,
                 statusText: req.statusText,
                 response: req.response
             });
         }
     }
 }