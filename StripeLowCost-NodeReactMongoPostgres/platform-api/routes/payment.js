const Router = require("express").Router;
module.exports = (app) => {
  let router = new Router();

  router.get("/payment/:id",
    app.actions.payment.render
  );

  router.post("/payment/:id/check",
    app.actions.payment.check
  );

  return router;
};
