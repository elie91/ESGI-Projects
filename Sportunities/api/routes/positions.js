const Router = require("express").Router;

module.exports = app => {
  let router = new Router();

  router.get("/", app.actions.positions.getPositions);
  router.post("/", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.positions.createPosition);
  router.get("/:id", app.actions.positions.getPosition);
  router.put("/:id", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.positions.updatePosition);
  router.delete("/:id", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.positions.deletePosition);

  return router;
};
