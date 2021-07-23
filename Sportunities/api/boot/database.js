module.exports = (app) => {
  return {
    syncModels
  };

  async function syncModels() {
    const associations = Object.keys(app.associations).map((association) => {
      if (process.env.NODE_ENV !== 'production') app.logger.info(`[model] Syncing ${association} associations`);
      return app.associations[association](app);
    });
    return Promise.all(associations)
      .then(() => {
        // Synchronize models with database
        return app.sequelize.sync({force: app.config.database.option.force});
      })
      .catch((err) => {
        app.logger.error('[model] Unable to associate models :', err);
        process.exit(0);
      });
  }
};
