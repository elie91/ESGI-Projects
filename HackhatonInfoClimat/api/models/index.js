const { Sequelize, DataTypes } = require("sequelize");

module.exports = app => {
  app.sequelize = new Sequelize({
    database: process.env.MYSQL_DATABASE,
    dialect: "mysql",
    host: process.env.MYSQL_HOST,
    logging: app.config.database.option.log,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    timezone: "+01:00",
    //schema: "public",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  app.helpers.operators = {
    or: Sequelize.Op.or,
    and: Sequelize.Op.and,
    notLike: Sequelize.Op.notLike,
    like: Sequelize.Op.like,
    ne: Sequelize.Op.ne,
    not: Sequelize.Op.not,
    gte: Sequelize.Op.gte,
    eq: Sequelize.Op.eq,
    gt: Sequelize.Op.gt,
    lt: Sequelize.Op.lt,
    lte: Sequelize.Op.lte,
    between: Sequelize.Op.between,
    in: Sequelize.Op.in,
    notIn: Sequelize.Op.notIn,
  };

  // Fixture models
  const Fixtures = app.sequelize.define("Fixtures", {
    version: {
      type: DataTypes.STRING(45),
    },
  }, {
    ...app.config.database.models,
  });

  // Add models
  app.models = {
    ClimatologieJournaliere: require("./Climatologie_journaliere")(app, Sequelize),
    HistoricEvents: require("./Historic_events")(app, Sequelize),
    HistoricNormales: require("./Historic_normales")(app, Sequelize),
    HistoricValues: require("./Historic_values")(app, Sequelize),
    Stations: require("./Stations")(app, Sequelize),
    Fixtures,
  };
  app.associations = {
    core (app) {
      let relations = {};
      const {
        ClimatologieJournaliere,
        HistoricEvents,
        HistoricNormales,
        HistoricValues,
        Stations
      } = app.models;
      let models = app.models;
      // Link User & VideoItem
      //relations.userVideos = app.models.User.hasMany(app.models.Video, { as: "videos", foreignKey: "owner_id" });
      //relations.videoUsers = app.models.Video.belongsTo(app.models.User, { as: "user", foreignKey: "owner_id" });

      app.relations = relations;
    },
  };
  app.openConnection = app.sequelize
    .authenticate()
    .then(() => {
      app.logger.info("[model] Connection has been established successfully!");
    })
    .catch((err) => {
      app.logger.error("[model] Unable to connect to the database:", err);
    });

};
