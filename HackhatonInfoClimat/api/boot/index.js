module.exports = (app) => {
  app.logger = require('./logger')(app);
  const {syncModels} = require('./database')(app);
  app.boot = async function boot(...params) {
    //app.transporter = require('./sendmail')(app);
    app.logger.info('---');
    // Wait for the connectin to be opened with the database
    await app.openConnection;
    try {
      // Then we sync the models relations
      await syncModels();
      await app.sequelize.sync({
        force: app.config.database.option.force,
        //alter: app.config.database.option.alter
      });

      // eslint-disable-next-line prefer-spread
      app.listen.apply(app, params);
    } catch (error) {
      app.logger.error('[model] Unable to associate models :', error);
      process.exit(0);
    }
  };
};
