const Router = require("express").Router;

module.exports = app => {
  let router = new Router();

  router.get("/", app.actions.experiences.getExperiences);
  router.post("/", app.middlewares.verifyToken(app, ["ROLE_PLAYER", "ROLE_ADMIN"]), app.actions.experiences.createExperience);
  router.get("/:id", app.actions.experiences.getExperience);
  router.put("/:id", app.middlewares.verifyToken(app, ["ROLE_PLAYER", "ROLE_ADMIN"]), app.actions.experiences.updateExperience);
  router.delete("/:id", app.middlewares.verifyToken(app, ["ROLE_PLAYER", "ROLE_ADMIN"]), app.actions.experiences.deleteExperience);

  return router;
};
