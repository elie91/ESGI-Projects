const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, printf} = format;
const chalk = require('chalk');
const cors = require("cors");
const helmet = require("helmet");

const package = require(`${__dirname}/../package.json`);

const levels = {
  info: chalk.greenBright,
  warn: chalk.yellow,
  error: chalk.red
};

const logFormat = printf(({level, message, label, timestamp}) => `${timestamp} [${label}][${level}] ${JSON.stringify(message)}`);
const consoleFormat = printf(({level, message, label, timestamp}) => levels[level](`${timestamp} [${label}][${level}] ${JSON.stringify(message)}`));

module.exports = app => {
  const appName = package.name;

  app.disable("x-powered-by");
  app.use(helmet());

  // CORS
  app.use(cors());
  app.options(app.config.cors.origin, cors());

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", app.config.cors.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
    next();
  });

  // Initialize logger method
  const logger = createLogger({
    format: combine(
      label({label: appName}),
      timestamp(),
      logFormat
    )
  });

  // If we're not in production then log to the `console`:
  if (!process.env.NODE_ENV || process.env.NODE_ENV == 'dev') {
    logger.add(new transports.Console({
      format: combine(
        label({label: appName}),
        timestamp(),
        consoleFormat
      )
    }));
  } else {
    logger.add(new transports.File({filename: 'logs/error.log', level: 'error'}));
    logger.add(new transports.File({filename: 'logs/combined.log',}));
  }

  logger.info(`Starting ${appName} application`);
  app.logger = logger;
};
