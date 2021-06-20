const http = require("http");
const querystring = require("querystring");
const jwt = require("jsonwebtoken");
const {Op} = require("sequelize");
const fs = require("fs");

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
    mercurePublish,
    orConditionFormatParams,
    ownerParam,
    isGranted,
    searchByPage,
    getDepartmentLocalisation
  };

  /**
   * [Check if data exist]
   * @param {number, string} data  data
   */
  function ensureOne(data) {
    return (data) ? data : Promise.reject();
  }

  /**
   * [Check if data exist, is an array and is not empty]
   * @param {Array} data  data
   */
  function ensureOneArray(data) {
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
  function getModelMethods(model) {
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
  function isEmpty(obj) {
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
  function reject({code, fields = [], data, message, error, display = "error.unknownError"}) {
    return Promise.reject({
      code,
      fields,
      data,
      message,
      err: error,
      display,
    });
  }

  function prettifyValidationErrors(errors) {
    return Object.keys(errors).reduce((acc, field) => {
      if (field === "errors") {
        acc[field] = errors[field].map(function (_err) {
          return {field: _err.path, message: _err.message};
        });
      }
      return acc;
    }, {});
  }

  function generateToken(type) {
    return type + "_" + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
  }

  function createToken(payload) {
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

  function verifyToken(token) {
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

  function orConditionFormatParams(params) {
    let object = [];
    console.log(params)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (key === "owner_id") return;
        object.push({[key]: {[Op.iLike]: `%${value}%`}});
      }
    }
    if (object.length > 0) {
      return {[Op.or]: object};
    }
    return {};
  }

  function ownerParam(params) {
    let object = [];
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (key !== "owner_id") return;
        object.push({[key]: {[Op.eq]: `${value}`}});
      }
    }
    if (object.length > 0) {
      return {[Op.or]: object};
    }
    return {};
  }

  /**
   * [push notification to mercure to notice front when we have change]
   * @param {string} uri topic
   * @param {object} data data for transmit front
   */
  function pushNotification(uri, data) {
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

  function processData($) {
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

  function mercurePublish(topic, data, entity, method) {
    const postData = querystring.stringify({
      "topic": topic,
      "data": JSON.stringify({
        ...data,
        entity,
        method,
      }),
    });

    console.log(postData);

    const req = http.request({
      hostname: app.config.caddy.hostname,
      port: app.config.caddy.port,
      path: app.config.caddy.path,
      method: "POST",
      headers: {
        "Authorization": "Bearer " + app.config.caddy.bearer,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    }, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
    });
    req.write(postData);

    req.on("error", (e) => {
      console.error(`An error occurred: ${e.message}`);
    });

    req.end();
  }

  function isGranted(role, user) {
    const userRole = user.role[0];
    const roles = Array.isArray(role) ? role : [role];
    if (userRole === "ROLE_ADMIN") {
      return true;
    }
    let success = false;
    roles.forEach(r => {
      if ((userRole === "ROLE_PLAYER" || userRole === "ROLE_AGENT") && r === "ROLE_USER") {
        success = true;
        return;
      }
      if (userRole === r) {
        success = true;
      }
    });

    return success;
  }

  async function searchByPage(model, condition, limit = 30, offset = 1) {
    return model
        .findAndCountAll({
          where: condition,
          offset: offset,
          limit: limit
        })
        .then((result) => {
          return {
            data: result.rows,
            metadata: {
              count: result.count,
              page: offset
            }
          }
        })
        .catch((err) => {
          console.log(err);
          Promise.reject(err);
        });
  }

  function getDepartmentLocalisation(department) {
    const correspondance = [
      {localisation: '42', departments: ['67', '68']},
      {localisation: '72', departments: ['24','33','40','47','64']},
      {localisation: '83', departments: ['15','43','63','03']},
      {localisation: '26', departments: ['21','58','71','89']},
      {localisation: '53', departments: ['22','29','35','56']},
      {localisation: '21', departments: ['10','51','52','08']},
      {localisation: '94', departments: ['2A','2B']},
      {localisation: '43', departments: ['25','39','70','90']},
      {localisation: '11', departments: ['75','91','92','93','77','94','95','78']},
      {localisation: '91', departments: ['11','30','34','48','66']},
      {localisation: '74', departments: ['19','23','87']},
      {localisation: '24', departments: ['18','28','36','37','41','45']},
      {localisation: '41', departments: ['54','55','57','88']},
      {localisation: '73', departments: ['12','31','32','46','65','81','82','09']},
      {localisation: '31', departments: ['59','62']},
      {localisation: '25', departments: ['14','50','61']},
      {localisation: '23', departments: ['27','76']},
      {localisation: '52', departments: ['44','49','53','72','85']},
      {localisation: '22', departments: ['60','80','02']},
      {localisation: '54', departments: ['16','17','79','86']},
      {localisation: '93', departments: ['13','83','84','04','05','06']},
      {localisation: '82', departments: ['26','38','42','69','73','74','01','07']},
    ]

    return correspondance.find(row => row.departments.includes(department))
  }
};
