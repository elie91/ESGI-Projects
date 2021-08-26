module.exports = (app, fields) => {
  fields = (fields instanceof Array) ? fields : [fields];

  return (req, res, next) => {
    let error = {};
    let missings = [];
    fields.forEach((field) => {
      if (!req.body[field.name] && req.body[field.name] !== "" && req.body[field.name] !== 0) {
        missings.push(field.name)
      }
    });
    let wrongTypes = [];
    fields.forEach((field) => {
      if (typeof req.body[field.name] !== field.type) {
        wrongTypes.push(field.name)
      }
    });

    if (missings.length > 0) {
      error = {
        code: 400,
        type: `err101`,
        fields: missings,
        data: ``,
        message: `missingFields`,
        err: ``
      };
      app.logger.error({ error });
      return res.error(error);
    }

    else if (wrongTypes.length > 0) {
      error = {
        code: 400,
        type: `err103`,
        fields: wrongTypes,
        data: ``,
        message: `wrongTypes`,
        err: ``
      };
      app.logger.error({ error });
      return res.error(error);
    }
    
    else{
      next();
    }
  }
};
