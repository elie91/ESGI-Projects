module.exports = app => {
  const bodyParser = require("body-parser");

  const cors = require("cors");

  app.use(cors());
  app.options(app.config.cors.origin, cors());

  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

  app.use(require("./res"));

  app.middlewares = {
    ensureFields: require("./ensureFields"),
    verifyToken: require("./verifyToken"),
  };

};
