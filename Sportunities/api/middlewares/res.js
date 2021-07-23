module.exports = (req, res, next) => {
  res.success = (data) => {
    if (!data) {
      return res.status(204).send()
    }
    return res.json(data);
  };

  res.error = (error) => {
    // add message and error if we'r in dev ENV
    if (!process.env.NODE_ENV || process.env.NODE_ENV === `dev`) {
      if (!error.code) {
        return res.status(400).send({
          type: `err301`,
          fields: ``,
          data: ``,
          message: `UnknownError`,
          err: error || ``
        });
      } else {
        const {code, type, fields, data, message, err} = error;
        return res.status(code).send({
          type: type,
          fields: fields || ``,
          data: data || ``,
          message: message,
          err: err || ``
        });
      }
    }

    // remove message and error if we are in prod ENV
    else {
      if (!error.code) {
        return res.status(400).send({type: `err301`, fields: ``, data: ``});
      } else {
        const {code, type, fields, data} = error;
        return res.status(code).send({type: type, fields: fields || ``, data: data || ``});
      }
    }
  };

  next();
};
