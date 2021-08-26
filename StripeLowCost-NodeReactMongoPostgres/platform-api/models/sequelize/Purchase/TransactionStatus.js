module.exports = (app, Sequelize) => {
  const TransactionStatus = {
    name: {
      type: Sequelize.STRING(45),
      allowNull: false,
      primaryKey: true
    },
  };
  const TransactionStatusModel = app.sequelize.define('Transaction_status', TransactionStatus, {
    ...app.config.sequelize.model
  });

  TransactionStatusModel.addHook("afterCreate", (transactionStatus, options) => {
    new app.mongoose.models.TransactionStatus({
      name: transactionStatus.name,
    }).save()
        // .then(app.logger.info("[platform-api][model][sequelize][User] afterCreate workded"))
        .catch((err) => { app.logger.error("[platform-api][model][sequelize][TransactionStatus] afterCreate failed", err);});
  });


  return TransactionStatusModel;
};
