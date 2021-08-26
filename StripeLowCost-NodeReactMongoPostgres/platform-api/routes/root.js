const Router = require('express').Router;
module.exports = (app) => {
  let router = new Router();

  router.get(
    "/hello",
    app.middlewares.ensureFields(app,[
      { name: 'name', type: 'string'},
    ]),
    app.actions.root.test
  );

  router.get(
    "/",
    app.actions.root.test
  );
  
  return router;
};
