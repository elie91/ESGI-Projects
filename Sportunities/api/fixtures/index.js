const fs = require('fs');
const path = require('path');

// Mock express app
const app = { disable: () => {}, use: () => {}, listen: () => run(), isExternMode: true };
app.moduleToKeep = [ 'boot', 'config', 'helpers', 'models', 'services' ];

require('../boot')(app); app.logger.info('Booting application ...');
require('../config')(app); app.logger.info('Loading config ...');
require('../helpers')(app); app.logger.info('Loading helpers ...');
require('../models')(app); app.logger.info('Loading models ...');
require('../services')(app); app.logger.info('Loading services ...');

app.boot(app.config.port, () => {
  run();
});

async function run() {
  app.logger.info('Running fixtures ...');
  const files = readFixtures();
  const fixturesVersion = await app.models.Fixtures.findOne({
    order: [
      [ 'createdAt', 'DESC' ],
      [ 'id', 'DESC' ],
    ]
  });
  let version = null;
  if (fixturesVersion && fixturesVersion.version) {
    // eslint-disable-next-line prefer-destructuring
    version = fixturesVersion.version;
  }

  executeFixture(files, version);
}

function getVersionName(file) {
  const name = file.split('.js');
  const splittedName = name[0].split('-');

  if (splittedName.length > 1) {
    return splittedName[0];
  }
  return name[0];
}

// eslint-disable-next-line consistent-return
async function executeFixture(files, version = null) {
  const transaction = await app.sequelize.transaction();

  app.logger.info('---');
  // If there is no fixture left to run
  if (!files[0]) return false;

  let fixture;
  if (version === null) {
    [ fixture ] = files;
  } else {
    const idx = files.findIndex((file) => {
      return getVersionName(file) == version;
    });
    if (idx < 0) return false;
    fixture = files[idx + 1];
  }

  if (!fixture) {
    app.logger.info('No new fixtures to run ...');
    exit();
  }

  const versionName = getVersionName(fixture);
  try {
    app.logger.info(`Fixtures ${fixture}...`);

    const fixtures = await require(`./version/${fixture}`)(app);
    // eslint-disable-next-line no-restricted-syntax
    for await (const fixture of fixtures) {
      const { model, data, update } = fixture;
      app.logger.info(`Running fixture for model \`${model}\``);
      // eslint-disable-next-line no-restricted-syntax
      for await (const item of data) {
        if (!app.models[model]) {
          app.logger.error(`Cannot find model ${model} ...`);
          // eslint-disable-next-line no-continue
          continue;
        }
          await app.models[model].upsert(item, { transaction });
      }
    }

    await app.models.Fixtures.create({ version: versionName }, { transaction });

    await transaction.commit();
    app.logger.info('Ending fixtures');
    // Remove item from the beginning of the array
    files.unshift();
    if (files[0]) {
      return executeFixture(files, versionName);
    }
    return exit();
  } catch (error) {
    await transaction.rollback();
    app.logger.err(error);
    app.logger.error(`Cannot run fixture version ${fixture} ...`);
    exit();
  }
}

function isSemver(string) {
  return string.split('.').length === 3;
}

function readFixtures() {
  const files = fs.readdirSync(path.resolve(__dirname, './version/'));
  const filteredFiles = files.filter(file => file[0] !== '.');

  const semverFiles = filteredFiles.filter(file => isSemver(getVersionName(file))).map(getVersionName);
  const datedFiles = filteredFiles.filter(file => !isSemver(getVersionName(file)));

  /**
   * @see https://stackoverflow.com/questions/40201533/sort-version-dotted-number-strings-in-javascript
   */
  const sortedSemvcer = semverFiles
    .map(a => a.split('.').map(n => +n + 100000).join('.')).sort()
    .map(a => a.split('.').map(n => +n - 100000).join('.'));
  datedFiles.sort();
  return [ ...sortedSemvcer, ...datedFiles ];
}

function exit() {
  process.exit(0);
}
