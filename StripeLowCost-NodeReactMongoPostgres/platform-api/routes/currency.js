const Router = require("express").Router;
module.exports = (app) => {
  let router = new Router();

  router.get(
    "/",
    app.actions.currency.cget
  );

  return router;
};
