import fetch from "./fetch";
/*jshint esversion: 6 */
// eslint-disable-next-line no-redeclare, no-unused-vars
/*global fetch, btoa */
import Q from "q";
/**
 *
 * @class API
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
let API = (function () {
  "use strict";

  function API(options) {
    let domain = typeof options === "object" ? options.domain : options;
    this.domain = domain ? domain : "";
    if (this.domain.length === 0) {
      throw new Error("Domain parameter must be specified as a string.");
    }
  }

  function serializeQueryParams(parameters) {
    let str = [];
    for (let p in parameters) {
      // eslint-disable-next-line no-prototype-builtins
      if (parameters.hasOwnProperty(p)) {
        str.push(
          encodeURIComponent(p) + "=" + encodeURIComponent(parameters[p]),
        );
      }
    }
    return str.join("&");
  }

  function mergeQueryParams(parameters, queryParameters) {
    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(
        function (parameterName) {
          let parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        },
      );
    }
    return queryParameters;
  }

  /**
   * HTTP Request
   * @method
   * @name API#request
   * @param {string} method - http method
   * @param {string} url - url to do request
   * @param {object} parameters
   * @param {object} body - body parameters / object
   * @param {object} headers - header parameters
   * @param {object} queryParameters - querystring parameters
   * @param {object} form - form data object
   * @param {object} deferred - promise object
   */
  API.prototype.request = function (
    method,
    url,
    parameters,
    body,
    headers,
    queryParameters,
    form,
    deferred,
  ) {
    const queryParams =
      queryParameters && Object.keys(queryParameters).length
        ? serializeQueryParams(queryParameters)
        : null;
    const urlWithParams = url + (queryParams ? "?" + queryParams : "");

    if (body && !Object.keys(body).length) {
      body = undefined;
    }

    fetch(urlWithParams, {
      method,
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((body) => {
        deferred.resolve(body);
      })
      .catch((error) => {
        deferred.reject(error);
      });
  };
  
  

  return API;
})();

// eslint-disable-next-line no-undef
// exports.API = API;
export default API;
