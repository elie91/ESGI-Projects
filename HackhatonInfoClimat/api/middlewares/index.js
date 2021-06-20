module.exports = app => {
  const cors = require('cors');

  app.use(cors());
  app.options(app.config.cors.origin, cors());

  app.use(require('./res'));

  app.middlewares = {
    ensureFields: require('./ensureFields'),
    verifyToken: require('./verifyToken')
  };

};
