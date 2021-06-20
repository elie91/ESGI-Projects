module.exports = (app, Sequelize) => {
  const Stations = {
    uniqueid: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: Sequelize.STRING(255)
    },
    genre: {
      type: Sequelize.STRING(255)
    },
    libelle: {
      type: Sequelize.STRING(255)
    },
    departement: {
      type: Sequelize.STRING(255)
    },
    pays: {
      type: Sequelize.STRING(255)
    },
    latitude: {
      type: Sequelize.DOUBLE
    },
    longitude: {
      type: Sequelize.DOUBLE
    },
    altitude: {
      type: Sequelize.INTEGER
    },
    orientation: {
      type: Sequelize.INTEGER
    },
    station_reference: {
      type: Sequelize.STRING(255)
    },
    pas_de_synop: {
      type: Sequelize.BOOLEAN
    },
    climato_only: {
      type: Sequelize.BOOLEAN
    },
    dh_min_climato: {
      type: Sequelize.DATEONLY()
    },
    dh_min_live: {
      type: Sequelize.DATEONLY()
    },
    dh_ouverture: {
      type: Sequelize.DATEONLY()
    },
    base_climato: {
      type: Sequelize.BOOLEAN
    },
    last_report: {
      type: Sequelize.DATE
    },
    last_data: {
      type: Sequelize.DATE
    },
  };

  return app.sequelize.define("stations", Stations, {
    ...app.config.database.model,
    timestamps: false
  });
};
