module.exports = (app, Sequelize) => {
  const View = {
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };

  return app.sequelize.define("View", View, {
    ...app.config.database.model
  });

};
