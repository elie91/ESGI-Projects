const { generateFixture } = require('./fixtures');

const app = { isExternMode: true };
require('../boot')(app); app.logger.info('Booting application ...');

const args = process.argv.slice(2);
const fixtureName = args.join(' ');

app.logger.info(`Generationg fixtures : ${fixtureName}`);

const newFixture = generateFixture(fixtureName);

app.logger.info(`Created fixture : ${newFixture}`);
