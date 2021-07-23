module.exports = (app, Sequelize) => {
  const Position = {
    value: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {args: true, msg: "errors.required"},
      }
    },
  };

  const PositionModel = app.sequelize.define("Position", Position, {
    ...app.config.database.model,
  });

  return PositionModel;
};
