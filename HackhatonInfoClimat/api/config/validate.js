const app = {};

require('../boot')(app);
app.logger.info('Booting application ...');
require('./index')(app);
app.logger.info('Loading config ...');
app.logger.info('Config file is valide 👍');
