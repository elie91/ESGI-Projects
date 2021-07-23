module.exports = (app, role, isOptional = false) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.get("Authorization");

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");
        return await app.helpers.verifyToken(token)
          .catch(error => console.error(error) || res.status(401).json({ message: "errors.verifyToken" }))
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
      } else {
        if (isOptional) {
          next();
        }
      }
    } catch (error) {
      app.logger.error({ error });
      res.error(error);
    }
  };
};
