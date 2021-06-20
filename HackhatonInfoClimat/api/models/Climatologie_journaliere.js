module.exports = (app, Sequelize) => {
  const Climatologie_journaliere = {
    id_station: {
      type: Sequelize.STRING(255),
      primaryKey: true
    },
    jour: {
      type: Sequelize.INTEGER
    },
    mois: {
      type: Sequelize.INTEGER
    },
    annee: {
      type: Sequelize.STRING(4)
    },
    tn: {
      type: Sequelize.INTEGER
    },
    tx: {
      type: Sequelize.INTEGER
    },
    rr: {
      type: Sequelize.INTEGER
    },
    ens: {
      type: Sequelize.INTEGER
    }
  };

  return app.sequelize.define("climato_journaliere", Climatologie_journaliere, {
    ...app.config.database.model,
    timestamps: false
  });
};
