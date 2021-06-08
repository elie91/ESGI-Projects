module.exports = app => {
  const bodyParser = require('body-parser');

  app.use(bodyParser.json({limit: '2mb'}));
  app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));

  app.use(require('./res'));
  app.middlewares = {
    bodyParser: bodyParser,
    ensureFields: require('./ensureFields'),
  };
};
