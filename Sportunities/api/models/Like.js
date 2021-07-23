module.exports = (app, Sequelize) => {
  const Like = {
    liked: {
      type: Sequelize.BOOLEAN(),
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };

  return app.sequelize.define("Like", Like, {
    ...app.config.database.model
  });

};
