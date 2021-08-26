import { LS_TOKEN } from "../../config/constant";
import { differenceInCalendarDays } from "date-fns";

export const getFilePerEndpoint = (endpoint, filename) => {
  return require("@/api/" + endpoint + "/" + filename + ".js");
};

export const phoneRegex = RegExp(
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
);

export const formatDate = date => {
  return date instanceof Date ? date.toLocaleDateString() : new Date(date).toLocaleDateString();
};

export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export const getTotalPriceRent = (dateStart, dateEnd, price) => {
  return price * differenceInCalendarDays(dateEnd, dateStart);
};

export const toQueryString = (obj, prefix) => {
  const str = [];
  const keys = obj instanceof Map ? obj.keys() : Object.keys(obj);

  for (const p of keys) {
    let k = prefix ? prefix + "[" + p + "]" : p,
      v = obj instanceof Map ? obj.get(p) : obj[p];
    str.push(
      v !== null && typeof v === "object"
        ? toQueryString(v, k)
        : encodeURIComponent(k) + "=" + encodeURIComponent(v),
    );
  }
  return str.join("&");
};

export const request = async (url, _options) => {

  const defaultConfig = {
    pagination: {
      grabAll: false,
      enabled: false,
      itemsPerPage: 30,
      withMetadata: false,
    },
  };

  let { method, id, query, body, ...requestConfig } = _options || {
    method: "GET",
    id: null,
    query: null,
    body: null,
  };

  requestConfig = {
    ...defaultConfig,
    ...requestConfig,
  };

  const options = {
    method: method,
    headers: {
      Accept: "application/ld+json",
      "Content-Type": "application/json",
    },
    mode: "cors",
  };

  const token = localStorage.getItem(LS_TOKEN);
  if (token) {
    options.headers.Authorization = "Bearer " + token;
  }

  if (body) options.body = JSON.stringify(body);

  if (requestConfig.pagination.enabled && url.indexOf("itemsPerPage") === -1) {
    query = query || {};
    query.itemsPerPage = requestConfig.pagination.itemsPerPage;
  }

  return fetch(url + (id ? "/" + id : "") + (query ? "?" + toQueryString(query) : ""),
    options,
  )
    .then((response) => {
      if (response.status === 204) {
        return Promise.resolve({});
      }
      if ([403, 401].includes(response.status)) {
        if (response.status === 401) {
          return response.text().then((error) => {
            let _error = JSON.parse(error);
            throw new RequestException(_error.message);
          });
        }
        throw new new RequestException("security.errors.denied");
      }

      if (response.status === 500) {
        throw new RequestException("security.errors.serverError");
      }

      if (response.headers.get("content-type").match(/application\/(ld\+)?json/) === null) {
        throw new RequestException("security.errors.badRequest");
      }

      return response.json();
    })
    .then(
      async (json) => {
        if (json.violations) {
          let formattedErrors = {};
          json.violations.forEach(
            (error) => (formattedErrors[error.propertyPath] = error.message),
          );

          return Promise.reject({ errors: formattedErrors });
        }

        if (json["@type"] === "hydra:Error" && json["hydra:description"] === "Not Found") {
          return Promise.reject({ type: "request", message: "security.errors.notFound" });
        }

        return Promise.resolve(json);
      },
    );
};

function RequestException (message) {
  this.message = message;
  this.type = "request";
}

function ViolationsException (errors) {
  console.log(errors);
  this.errors = errors;
  this.type = "request";
}

export const debounce = (callback, delay) => {
  let timer;
  return function () {
    const args = arguments;
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, delay);
  };
};
