const http = require("http");
const querystring = require("querystring");
const jwt = require("jsonwebtoken");
const https = require("https");

module.exports = app => {

  app.helpers = {
    ensureOne,
    ensureOneArray,
    getModelMethods,
    isEmpty,
    reject,
    prettifyValidationErrors,
    generateToken,
    createToken,
    verifyToken,
    pushNotification,
    processData,
    sendEmailTo,
  };

  /**
   * [Check if data exist]
   * @param {number, string} data  data
   */
  function ensureOne (data) {
    return (data) ? data : Promise.reject();
  }

  /**
   * [Check if data exist, is an array and is not empty]
   * @param {Array} data  data
   */
  function ensureOneArray (data) {
    if (data === undefined || data.length === 0) {
      return Promise.reject();
    }
    return data;
  }

  /**
   ** [Print all available methods for that Model]
   * @param {object} model  Model
   *
   */
  function getModelMethods (model) {
    for (let assoc of Object.keys(model.associations)) {
      for (let accessor of Object.keys(model.associations[assoc].accessors)) {
        console.log(model.name + "." + model.associations[assoc].accessors[accessor] + "()");
      }
    }
  }

  /**
   * [Check if the object is empty]
   * @param {object} obj Object
   */
  function isEmpty (obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  /**
   * [Reject error respecting the format code, type, fields, data, message, error]
   * @param {number} code http error code
   * @param {string} type app error code
   * @param {string} fields Array of field concerned by the error
   * @param {string} data data for some case
   * @param {string} message message describing the error for dev ENV
   * @param {object} error raw error for dev END
   */
  function reject (code, type, fields, data, message, error) {
    return Promise.reject({
      code: code,
      type: type,
      fields: fields,
      data: data,
      message: message,
      err: error,
    });
  }

  function prettifyValidationErrors (errors) {
    return Object.keys(errors).reduce((acc, field) => {
      if (field === "errors") {
        acc[field] = errors[field].map(function (_err) {
          return { field: _err.path, message: _err.message };
        });
      }
      return acc;
    }, {});
  }

  function generateToken (type) {
    return type + "_" + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
  }

  function createToken (payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        app.config.jwt.salt,
        {
          algorithm: "HS256",
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) {
            reject();
          } else {
            resolve(token);
          }
        },
      );
    });
  }

  function verifyToken (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, app.config.jwt.salt, (err, decodedToken) => {
        if (err) {
          reject(500);
        } else {
          resolve(decodedToken);
        }
      });
    });
  }

  /**
   * [push notification to mercure to notice front when we have change]
   * @param {string} uri topic
   * @param {object} data data for transmit front
   */
  function pushNotification (uri, data) {
    let _data = querystring.stringify({
      topic: "http://localhost:3000/" + uri,
      data: data,
    });

    const req = http.request({
      hostname: app.config.mercure.hostname,
      port: app.config.mercure.port,
      path: app.config.mercure.path,
      method: "POST",
      headers: {
        Authorization: "Bearer " + app.config.mercure.jwt,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(_data),
      },
    });
    req.on("error", function (err) {
      console.error(err.message);
    });
    req.write(data);
    req.end();
  }

  function processData ($) {
    const data = [];
    const table = $(".spotexchangerate .c-table.c-table--generic.c-shadow-overflow__table-fixed-column");
    table.find("thead th").each((i, origin) => {
      if (i > 0) {
        const _origin = $(origin).text().trim();
        table.find("tbody tr").eq(i - 1).find("td").each((j, destination) => {
          const amount = $(destination).text().trim();
          const _destination = table.find("thead th").eq(j + 1).text().trim();
          data.push({
            origin: _origin,
            destination: _destination,
            amount: amount,
            date: new Date(),
          });
        });
      }
    });
    return data;
  }

  function sendEmailTo (params) {

    const _data = JSON.stringify({
      to: [{ email: app.config.sendinblue.overrideEmailTo ? app.config.sendinblue.overrideEmailTo : params.email }],
      templateId: 1,
      params: {
        user: {
          "NAME": params.firstname,
        },
      },
    });

    const req = https.request({
      method: "POST",
      hostname: "api.sendinblue.com",
      path: "/v3/smtp/email",
      json: true,
      headers: {
        "api-key": app.config.sendinblue.apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Content-Length": _data.length,
      },
    }, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });
    req.on("error", function (err) {
      console.error(err);
    });
    req.write(_data);
    req.end();

  }

};
