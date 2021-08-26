const Sequelize = require("sequelize");
module.exports = app => {
  app.sequelize = new Sequelize({
    database: app.config.sequelize.name,
    dialect: "postgres",
    host: app.config.sequelize.host,
    logging: app.config.sequelize.option.loggin,
    password: app.config.sequelize.password,
    port: app.config.sequelize.port,
    username: app.config.sequelize.user,
    schema: "public",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  // Add models
  app.sequelize.models = {
    Merchant: require("./User/Merchant")(app, Sequelize),
    User: require("./User/User")(app, Sequelize),
    Currency: require("./Purchase/Currency")(app, Sequelize),
    TransactionStatus: require("./Purchase/TransactionStatus")(app, Sequelize),
    Transaction: require("./Purchase/Transaction")(app, Sequelize),
  };

  app.sequelize
    .authenticate()
    .then(() => {
      app.logger.info(
        "[platform-api][model][sequelize] Connection has been established successfully!",
      );
      let models = app.sequelize.models;

      // Merchant relation
      models.Merchant.hasMany(models.Transaction, { as: "transaction" });

      // User relation
      models.User.hasMany(models.Merchant, { as: "merchant" });

      // Transaction relation
      models.Transaction.hasMany(models.TransactionStatus, {
        foreignKey: {
          primaryKey: true,
        }, as: "transactionStatus",
      });

    })
    .then(() => {
      app.sequelize
        .sync({ force: app.config.sequelize.option.force })
        .then(async () => {});
    })
    .catch(err => {
      app.logger.error("platform-api][model][sequelize] Unable to connect to the database:", err);
    });
};
