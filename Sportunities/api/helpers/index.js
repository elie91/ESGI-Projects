const http = require("http");
const querystring = require("querystring");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const AWS = require("aws-sdk");
const ThumbnailGenerator = require("video-thumbnail-generator").default;
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
    getS3Instance,
    uploadToS3,
    isGranted,
    searchByPage,
    getLimitAndOffset,
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
  function reject ({ code, fields = [], data, message, error, display = "error.unknownError" }) {
    return Promise.reject({
      code,
      fields,
      data,
      message,
      err: error,
      display,
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

  function orConditionFormatParams (params) {
    let object = [];
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (key === "order" || key === "owner_id" || key === "page" || value === "true" || value === "false") return;
        object.push({ [key]: { [Op.iLike]: `%${value}%` } });
      }
    }
    if (object.length > 0) {
      return { [Op.or]: object };
    }
    return {};
  }

  function ownerParam (params) {
    let object = [];
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (key !== "owner_id" || key === "order") return;
        object.push({ [key]: { [Op.eq]: `${value}` } });
      }
    }
    if (object.length > 0) {
      return { [Op.or]: object };
    }
    return {};
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

  function mercurePublish (topic, data, entity, method) {
    const postData = querystring.stringify({
      "topic": topic,
      "data": JSON.stringify({
        ...data,
        entity,
        method,
      }),
    });

    //console.log(postData);

    console.log("process.env.MERCURE_HOST", process.env.MERCURE_HOST);
    console.log("process.env.MERCURE_PORT", process.env.MERCURE_PORT);

    const req = http.request({
      hostname: process.env.MERCURE_HOST,
      port: process.env.MERCURE_PORT,
      path: "/.well-known/mercure",
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.MERCURE_BEARER,
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

  function isGranted (role, user) {
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

  function getS3Instance () {
    return new AWS.S3({
      accessKeyId: process.env.NODE_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NODE_AWS_SECRET_KEY,
    });
  }

  function uploadToS3 (filename, body) {
    return new Promise((resolve, reject) => {
      const s3 = getS3Instance();
      s3.upload({
        Bucket: process.env.NODE_S3_BUCKET_NAME,
        Key: `uploads/${filename}`,
        Body: body,
        ACL: "public-read",
      }, function (err, data) {
        console.log(data, err);
        if (err) {
          reject(err);
        }
        resolve(data.Location);
      });
      // setTimeout(() => {
      //   resolve("https://sportunities-bucket.s3.eu-west-3.amazonaws.com/uploads/plus-de-30-kills-en-duo-avec-un-joueur-du-kazakhstan-warzone.mp4")
      // }, 10000);
    });
  }

  async function searchByPage (model, condition, limit = 30, page = 1, include = [], order = []) {
    return model
      .findAndCountAll({
        where: condition,
        include,
        order,
        offset: page ? (Number(page) - 1) * (limit ? limit : 25) : 0,
        limit: limit ? Number(limit) : 25,
      })
      .then((result) => {
        return {
          data: result.rows,
          metadata: {
            count: result.count,
            page,
          },
        };
      })
      .catch((err) => {
        console.log(err);
        Promise.reject(err);
      });
  }

  function getLimitAndOffset (page, limit) {
    return {
      offset: page ? (Number(page) - 1) * (limit ? limit : 25) : 0,
      limit: limit ? Number(limit) : 25,
    };
  }
};
