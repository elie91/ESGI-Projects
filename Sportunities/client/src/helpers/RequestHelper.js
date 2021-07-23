import { LS_JWT_TOKEN, LS_USER } from "../config/constant";
import { toQueryString } from "./Utils";
import NetworkError from "./Errors/NetworkError";
import SubmissionError from "./Errors/SubmissionError";
import TokenExpiredError from "./Errors/TokenExpiredError";
import TokenDeniedError from "./Errors/TokenDeniedError";
import NotFoundError from "./Errors/NotFoundError";

let requestFailedHandler = [];

const clearToken = () => {
  localStorage.removeItem(LS_JWT_TOKEN);
  localStorage.removeItem(LS_USER);
  setTimeout(() => {
    document.location.reload();
  }, 2000);
};

const RequestHelper = {
  addRequestFailedHandler: (handler) => {
    requestFailedHandler.push(handler);
  },


  request: async (url, _options = {
    method: "GET",
    id: null,
    query: null,
    body: null,
    headers: null,
  }) => {

    const options = {
      method: _options.method,
      headers: _options.headers ? _options.headers : { "Content-Type": "application/json" },
      mode: "cors",
    };

    const token = await localStorage.getItem(LS_JWT_TOKEN);

    if (token) {
      options.headers.Authorization = "Bearer " + token;
    }

    if (_options.body) {
      options.body = _options.body instanceof FormData ? _options.body : JSON.stringify(_options.body);
    }

    return fetch(
      url + (_options.id ? "/" + _options.id : "") + (_options.query ? "?" + toQueryString(_options.query) : ""),
      options,
    ).then((response) => {

      if (response.status === 204) {
        return Promise.resolve({});
      }

      if ([403, 401].includes(response.status)) {
        if (response.status === 401) {
          return response.text().then((error) => {
            if (error.search("errors.verifyToken") !== -1) {
              clearToken();
              throw new TokenExpiredError([
                { type: "request", message: "errors.api.token.expired" },
              ]);
            }
            if (error.search("errors.api.token.error") !== -1) {
              clearToken();
              throw new TokenExpiredError([
                { type: "request", message: "errors.api.token.expired" },
              ]);
            }
            if (error.search("security.invalid.credentials") !== -1) {
              throw new SubmissionError([
                { type: "request", message: "security.invalid.credentials" },
              ]);
            }
            throw new TokenDeniedError([
              { type: "request", message: "errors.api.token.denied" },
            ]);
          });
        }
      }

      if (response.status === 404) {
        throw new NotFoundError();
      }

      if (response.headers.get("content-type").match(/application\/(ld\+)?json/) === null) {
        throw new NetworkError([
          { type: "request", message: "errors.api.headers" },
        ]);
      }

      return response.json();

    }).then((json) => {
      if (json.errors) {
        return Promise.reject({ type: "fields", data: json.errors });
      }
      return Promise.resolve(json);
    }, (error) => {

      if (error.message === "errors.api.notFound") {
        return Promise.reject({ type: "request", message: "errors.api.notFound" });
      }

      if (error.message === "errors.api.network") {
        return Promise.reject({ type: "request", message: "errors.api.network" });
      }

      if (error.name === "SubmissionError") throw error;

      return Promise.reject({ type: "general", data: error.message });
    });
  },
};

export default RequestHelper;

