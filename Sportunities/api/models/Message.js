module.exports = (app, Sequelize) => {
  const Message = {
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    owner: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    viewedAt: {
      type: Sequelize.DATE
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };

  return app.sequelize.define("Message", Message, {
    ...app.config.database.model
  });

};
