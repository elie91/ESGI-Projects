const Router = require("express").Router;

module.exports = app => {
  let router = new Router();

  router.get("/", app.middlewares.verifyToken(app, ["ROLE_AGENT", "ROLE_PLAYER"]), app.actions.messages.getMessages);
  router.post("/", app.middlewares.verifyToken(app, ["ROLE_AGENT", "ROLE_PLAYER"]), app.actions.messages.createMessage);
  router.get("/:id", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.messages.getMessage);
  router.put("/:id", app.middlewares.verifyToken(app, ["ROLE_AGENT", "ROLE_PLAYER"]), app.actions.messages.updateMessage);
  router.delete("/:id", app.middlewares.verifyToken(app, ["ROLE_AGENT", "ROLE_PLAYER"]), app.actions.messages.deleteMessage);

  return router;
};
