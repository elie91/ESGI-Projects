module.exports = (app, Sequelize) => {
  const Historic_normales = {
    geoid: {
      type: Sequelize.BIGINT
    },
    mois: {
      type: Sequelize.INTEGER
    },
    tx: {
      type: Sequelize.FLOAT
    },
    tn: {
      type: Sequelize.FLOAT
    },
    precip: {
      type: Sequelize.FLOAT
    },
    altitude_ref: {
      type: Sequelize.FLOAT
    },
    nom_ref: {
      type: Sequelize.STRING(255)
    },
    dept_ref: {
      type: Sequelize.STRING(255)
    },
    distance: {
      type: Sequelize.FLOAT
    },
    wmo_ref: {
      type: Sequelize.STRING(255)
    },
  };

  return app.sequelize.define("historic_normales", Historic_normales, {
    ...app.config.database.model,
    timestamps: false
  });
};
