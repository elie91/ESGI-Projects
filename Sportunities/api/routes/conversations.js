const Router = require("express").Router;

module.exports = app => {
  let router = new Router();

  router.get("/", app.middlewares.verifyToken(app, ["ROLE_AGENT", "ROLE_PLAYER"]), app.actions.conversations.getConversations);
  router.post("/", app.middlewares.verifyToken(app, "ROLE_AGENT"), app.actions.conversations.createConversation);
  router.get("/:id", app.actions.conversations.getConversation);
  router.delete("/:id", app.middlewares.verifyToken(app, ["ROLE_AGENT", "ROLE_PLAYER"]), app.actions.conversations.deleteConversation);

  return router;
};
