module.exports = (app, Sequelize) => {
  const Merchant = {
    name: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    public_key: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    secret_key: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    kbis: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    postal_code: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    city: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(15),
      allowNull: false
    },
    confirmation_url: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    cancellation_url: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    approved: {
      type: Sequelize.BOOLEAN(),
      required: true,
      defaultValue: false
    },
    currency: {
      type: Sequelize.STRING(3),
      required: true,
      allowNull: false,
    }
  };

  return app.sequelize.define('Merchant', Merchant, {
    ...app.config.sequelize.model,
  });
};
