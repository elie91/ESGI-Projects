const Router = require('express').Router;

module.exports = app => {
  let router = new Router();

  router.get('/', app.actions.root.version)

  return router;
};
