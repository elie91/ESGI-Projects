const Router = require('express').Router;
module.exports = (app) => {
  let router = new Router();

  router.post("/login_check",
    app.actions.auth.login
  );

  return router;
};
