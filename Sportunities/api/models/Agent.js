module.exports = (app, Sequelize) => {
  const Agent = {
    banner: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
    isConfirmed: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
    confirmedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  };

  return app.sequelize.define("Agent", Agent, {
    ...app.config.database.model,
  });

};
