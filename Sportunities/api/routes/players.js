const Router = require("express").Router;

module.exports = app => {
  let router = new Router();

  router.get("/", app.middlewares.verifyToken(app), app.actions.players.getPlayers);
  router.get("/famous", app.actions.players.getFamousPlayer);
  router.post("/", app.middlewares.verifyToken(app, "ROLE_USER"), app.actions.players.createPlayer);
  router.get("/:id", app.actions.players.getPlayer);
  router.put("/:id", app.middlewares.verifyToken(app, "ROLE_USER"), app.actions.players.updatePlayer);

  return router;
};
