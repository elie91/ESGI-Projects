module.exports = (app, Sequelize) => {
  const Player = {
    banner: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    height: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    weight: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    nationality: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };


  return app.sequelize.define("Player", Player, {
    ...app.config.database.model
  });

};
