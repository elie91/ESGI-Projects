module.exports = (app, Sequelize) => {
  const Historic_values = {
    id_historic: {
      type: Sequelize.INTEGER(),
    },
    lieu: {
      type: Sequelize.STRING(255),
    },
    geoid: {
      type: Sequelize.INTEGER(),
    },
    dept: {
      type: Sequelize.STRING(255),
    },
    pays: {
      type: Sequelize.STRING(255),
    },
    valeur: {
      type: Sequelize.FLOAT(),
    },
    type: {
      type: Sequelize.TINYINT(),
    },
    date: {
      type: Sequelize.DATE(),
    },
    commentaire: {
      type: Sequelize.STRING(255),
    },
    est_record: {
      type: Sequelize.BOOLEAN(),
    },
    est_record_dpt: {
      type: Sequelize.BOOLEAN(),
    }
  };

  const HistoricValuesModel = app.sequelize.define("historic_values", Historic_values, {
    ...app.config.database.model,
    timestamps: false
  });

  return HistoricValuesModel;
};
