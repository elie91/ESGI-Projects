module.exports = (app, role) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");
        return await app.helpers.verifyToken(token)
          .catch(error => console.error(error) || res.status(400).json({ message: "errors.verifyToke," }))
          .then((payload) => {
            if (!role) {
              req.user = payload;
              next();
              return;
            }
            if (app.helpers.isGranted(role, payload)) {
              req.user = payload;
              next();
              return;
            }
            res.status(403).json({ message: "errors.unauthorized" });
          });
      }
    } catch (error) {
      app.logger.error({ error });
      res.error(error);
    }
  };
};
