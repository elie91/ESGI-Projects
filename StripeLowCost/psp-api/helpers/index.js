module.exports = app => {

  app.helpers = {
    ensureOne,
    ensureOneArray,
    isEmpty,
    reject,
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
      return Promise.reject()
    }
    return data;
  }

  /**
   * [Check if the object is empty]
   * @param {object} obj Object
   */
  function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
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
  function reject(code, type, fields, data, message, error) {
    return Promise.reject({
      code: code,
      type: type,
      fields: fields,
      data: data,
      message: message,
      err: error
    });
  }

};
