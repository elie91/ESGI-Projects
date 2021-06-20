const express = require('express');

const app = express();

app.use(express.static('upload'));

// Loading application stack
require('./boot')(app);
app.logger.info('Booting application ...');
require('./config')(app);
app.logger.info('Loading config ...');
require('./helpers')(app);

app.logger.info('Loading helpers ...');
require('./models')(app);
app.logger.info('Loading models ...');
require('./services')(app);
app.logger.info('Loading services ...');
require('./middlewares')(app);
app.logger.info('Loading middlewares ...');
require('./actions')(app);
app.logger.info('Loading actions ...');
require('./routes')(app);
app.logger.info('Loading routes ...');


app.boot(app.config.port, () => {
  app.logger.info(`App listening on http://localhost:${app.config.port}`);
});
