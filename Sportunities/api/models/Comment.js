module.exports = (app, Sequelize) => {
  const Comment = {
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };

  return app.sequelize.define("Comment", Comment, {
    ...app.config.database.model
  });

};
