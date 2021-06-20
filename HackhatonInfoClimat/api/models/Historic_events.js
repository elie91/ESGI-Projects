module.exports = (app, Sequelize) => {
  const Historic_events = {
    nom: {
      type: Sequelize.STRING(255),
    },
    localisation: {
      type: Sequelize.STRING(255),
    },
    importance: {
      type: Sequelize.TINYINT(),
    },
    type_cyclone: {
      type: Sequelize.STRING(255),
    },
    has_image_cyclone: {
      type: Sequelize.BOOLEAN(),
    },
    date_deb: {
      type: Sequelize.DATE(),
    },
    date_fin: {
      type: Sequelize.DATE(),
    },
    duree: {
      type: Sequelize.TINYINT(),
    },
    type: {
      type: Sequelize.STRING(255),
    },
    description: {
      type: Sequelize.TEXT('long'),
    },
    short_desc: {
      type: Sequelize.TEXT,
    },
    sources: {
      type: Sequelize.TEXT,
    },
    id_compte: {
      type: Sequelize.INTEGER(),
    },
    valeur_max: {
      type: Sequelize.FLOAT(),
    },
    bs_link: {
      type: Sequelize.INTEGER(),
    },
    gen_cartes: {
      type: Sequelize.TEXT,
    },
    why: {
      type: Sequelize.TEXT,
    },
    tableau_croise: {
      type: Sequelize.TEXT,
    },
    tableau_croise_cyclone: {
      type: Sequelize.TEXT,
    },
    hits: {
      type: Sequelize.INTEGER(),
    },
    notes: {
      type: Sequelize.TEXT,
    }
  };

  const HistoricEventsModel = app.sequelize.define("historic_events", Historic_events, {
    ...app.config.database.model,
    timestamps: false
  });

  return HistoricEventsModel;
};
