module.exports = (app, Sequelize) => {
  const Sport = {
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {args: true, msg: "errors.required"},
      }
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    color: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    image: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };

  const SportModel = app.sequelize.define("Sport", Sport, {
    ...app.config.database.model,
  });

  return SportModel;
};
