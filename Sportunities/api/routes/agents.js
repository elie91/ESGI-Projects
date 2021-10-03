const Router = require("express").Router;

module.exports = app => {
  let router = new Router();

  router.get("/",
      app.middlewares.verifyToken(app, "ROLE_ADMIN"),
      app.actions.agents.getAgents
  );
  router.post("/",
      app.middlewares.verifyToken(app, "ROLE_USER"),
      app.actions.agents.createAgent
  );
  router.get("/:id", app.actions.agents.getAgent);
  router.put("/:id",
      app.middlewares.verifyToken(app, "ROLE_USER"),
      app.actions.agents.updateAgent
  );

  return router;
};
