const Router = require("express").Router;
module.exports = (app) => {
  let router = new Router();

  router.post(
    "/",
    app.actions.user.create,
  );

  router.get(
    "/",
    app.middlewares.verifyToken(app, ["ADMIN", "MERCHANT"]),
    app.actions.user.getAll,
  );

  router.put("/:id",
    app.middlewares.verifyToken(app, ["ADMIN", "MERCHANT"]),
    app.actions.user.put
  );

  return router;
};
