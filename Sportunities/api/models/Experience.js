module.exports = (app, Sequelize) => {
  const Experience = {
    type: { // SCHOOL OR SPORT
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };

  return app.sequelize.define("Experience", Experience, {
    ...app.config.database.model,
  });

};
