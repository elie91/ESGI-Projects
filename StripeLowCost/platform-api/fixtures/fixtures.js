var faker = require('faker');

module.exports = async(app) => {
    await require('./resetDB.js')(app.sequelize.models, app.logger);
    app.logger.info(`[platform-api][faker][User] Loading User fixtures ...`);
    await require('./UserFixtures.js')("User", faker, app.sequelize.models, app.logger);
    await require('./MerchantFixtures.js')("Merchant", faker, app.sequelize.models, app.logger);
    require('./TransactionFixtures.js')("Transaction", faker, app.sequelize.models, app.logger);
};
