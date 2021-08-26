module.exports = (app, Sequelize) => {
  const Transaction = {
    amount: {
      type: Sequelize.DOUBLE(),
      allowNull: false,
    },
    client_lastname: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    client_firstname: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    billing_address: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    billing_postal_code: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    billing_city: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    products: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    payment_method: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    currency: {
      type: Sequelize.STRING(3),
      allowNull: false,
    }
  };

  const TransactionModel = app.sequelize.define("Transaction", Transaction, {
    ...app.config.sequelize.model,
  });

  TransactionModel.addHook("afterCreate", (transaction, options) => {
    // Create transaction status
    app.sequelize.models.TransactionStatus.build({
      name: app.config.constants.CREATED,
      TransactionId: transaction.id,
    })
        .save()
        .then("[platform-api][model][sequelize][Transaction] afterCreate create transaction status worked.")
        .catch(err => app.logger.error("[platform-api][model][sequelize][Transactino] afterCreate create transaction status failed :", err));
    // Insert in mongoose
    new app.mongoose.models.Transaction({
      transaction_id: transaction.id,
      amount: transaction.amount,
      client_lastname: transaction.client_lastname,
      client_firstname: transaction.client_firstname,
      billing_address: transaction.billing_address,
      billing_postal_code: transaction.billing_postal_code,
      billing_city: transaction.billing_city,
      products: transaction.products,
      payment_method: transaction.payment_method,
      currency: transaction.currency,
      merchant_id: transaction.MerchantId,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    })
        .save()
        .catch((err) => app.logger.error("[platform-api][model][sequelize][Transaction] afterCreate failed", err));
  });

  TransactionModel.addHook("afterUpdate", (transaction, options) => {
    app.logger.info("[platform-api][model][sequelize][User] afterUpdate start");
    app.mongoose.models.Transaction.findOne({ transaction_id: transaction.id })
        .then(_transaction => {
          transaction.payment_method = _transaction.payment_method;
          transaction.updateAt = new Date();
          transaction.save()
              // .then(app.logger.info("[platform-api][model][sequelize][User] afterUpdate workded"))
              .catch((err) => { app.logger.error("[platform-api][model][sequelize][Transaction] afterUpdated failed ", err);});
        });
  });

  return TransactionModel;
};
