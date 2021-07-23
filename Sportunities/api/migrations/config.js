const fs = require('fs');
const path = require('path');

// Mock express app
const app = { disable: () => {}, use: () => {}, listen: () => {}, isExternMode: true };

require('../boot')(app); app.logger.info('Booting application ...');
require('../config')(app); app.logger.info('Loading config ...');

const { name, user, option, ...databaseConfig } = app.config.database;
const config = {
  development: {
    ...databaseConfig,
    database: name,
    username: user,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  production: {
    ...databaseConfig,
    database: name,
    username: user,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    }
  }
};

module.exports = config;
