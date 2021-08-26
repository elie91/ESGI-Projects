module.exports = (app, Sequelize) => {
  const Currency = {
    origin: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    destination: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    amount: {
      type: Sequelize.DOUBLE(),
    },
  };
  return app.sequelize.define('Currency', Currency, {
    ...app.config.sequelize.model
  });
};
