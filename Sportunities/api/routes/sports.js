const Router = require("express").Router;

module.exports = app => {
  let router = new Router();

  router.get("/", app.actions.sports.getSports);
  router.post("/", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.sports.createSport);
  router.get("/:id", app.actions.sports.getSport);
  router.put("/:id", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.sports.updateSport);
  router.delete("/:id", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.sports.deleteSport);

  return router;
};
