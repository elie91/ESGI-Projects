const Router = require("express").Router;

module.exports = app => {
  let router = new Router();

  router.get("/", app.actions.clubs.getClubs);
  router.post("/", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.clubs.createClub);
  router.get("/:id", app.actions.clubs.getClub);
  router.put("/:id", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.clubs.updateClub);
  router.delete("/:id", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.clubs.deleteClub);

  return router;
};
