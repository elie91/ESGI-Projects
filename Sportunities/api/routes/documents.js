const Router = require("express").Router;

module.exports = app => {
  let router = new Router();

  router.get("/", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.documents.getDocuments);
  router.post("/", app.middlewares.verifyToken(app, "ROLE_USER"), app.actions.documents.createDocument);
  router.get("/:id", app.middlewares.verifyToken(app, ["ROLE_USER", "ROLE_ADMIN"]), app.actions.documents.getDocument);
  router.put("/:id", app.middlewares.verifyToken(app, ["ROLE_USER", "ROLE_ADMIN"]), app.actions.documents.updateDocument);
  router.delete("/:id", app.middlewares.verifyToken(app, "ROLE_ADMIN"), app.actions.documents.deleteDocument);

  return router;
};
