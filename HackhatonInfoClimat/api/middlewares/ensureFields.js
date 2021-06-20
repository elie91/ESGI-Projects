const { check, validationResult } = require("express-validator");

module.exports = (app) => {
  const { helpers: { isObject } } = app;
  const customRules = {
    isDate: (value) => {
      if (!Number.isNaN(new Date(value).getTime())) {
        return value;
      }
      throw new Error("DateError");
    },
  };

  return (fields) => {
    const fieldsToTest = (Array.isArray(fields)) ? fields : [fields];

    return async (req, res, next) => {
      const reducer = (initial, value) => initial[value];

      const missings = fieldsToTest
        .filter(fieldObj => fieldObj.mandatory)
        .map((fieldObj) => {
          if (fieldObj.field.split(".").reduce(reducer, req.body) === undefined) {
            return fieldObj.field;
          }
          return null;
        })
        .filter(field => field);

      if (missings.length > 0) {
        return res.error({
          code: 400,
          type: "err100",
          fields: missings,
          data: req.body,
          message: "missingFields",
          display: "error.missingFields",
          error: new Error("missingFields"),
        });
      }

      for await (const fieldObj of fieldsToTest.filter(fieldObj => fieldObj.validations)) {
        const { validations } = fieldObj;
        const _validations = Array.isArray(validations) ? validations : [validations];

        for await (const validation of _validations) {
          const _validation = isObject(validation) ? validation : { rule: validation, params: null };
          if (_validation.params) {
            if (fieldObj.mandatory) {
              check(fieldObj.field)[_validation.rule](_validation.params).run(req);
            }
          } else if (fieldObj.field !== "" || fieldObj.field !== undefined) {
            if (Object.keys(customRules).includes(_validation.rule)) {
              check(fieldObj.field).custom(customRules[_validation.rule]).run(req);
            } else {
              check(fieldObj.field)[_validation.rule]().run(req);
            }
          }
        }
      }

      const invalidFields = validationResult(req);

      if (!invalidFields.isEmpty()) {
        return res.error({
          code: 400,
          type: "err101",
          fields: invalidFields.array(),
          data: req.body,
          message: "invalidFields",
          display: "error.invalidFields",
          error: new Error("invalidFields"),
        });
      }

      return next();
    };
  };
};
