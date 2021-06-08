module.exports = async (app) => {
  require('./sequelize')(app);  app.logger.info("Loading sequelize ...");
  await require('./mongoose')(app);  app.logger.info("Loading mongoose ...");
};
