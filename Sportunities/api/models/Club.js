module.exports = (app, Sequelize) => {
  const Club = {
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    logo: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    postalCode: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
    approved: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };

  return app.sequelize.define("Club", Club, {
    ...app.config.database.model,
  });

};
