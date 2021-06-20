const path = require("path");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, errors } = format;
const chalk = require("chalk");
const pkg = require(path.join(__dirname, "../package.json"));
const levels = {
  info: chalk.greenBright,
  warn: chalk.yellow,
  error: chalk.red,
};

const logFormat = printf(({
  level,
  message,
  label,
  timestamp,
}) => `${timestamp} [${label}][${level}] ${JSON.stringify(message)}`);
const consoleFormat = printf(({
  level,
  message,
  label,
  timestamp,
}) => levels[level](`${timestamp} [${label}][${level}] ${JSON.stringify(message)}`));

module.exports = (app) => {
  const appName = pkg.name;

  // Initialize logger method
  const logger = createLogger({
    format: combine(
      errors({ stack: true }),
      label({ label: appName }),
      timestamp(),
      logFormat,
    ),
  });

  // If we're not in production then log to the `console`:
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    logger.add(new transports.Console({
      format: combine(
        label({ label: appName }),
        timestamp(),
        consoleFormat,
        errors({ stack: true }),
      ),
    }));
  } else {
    logger.add(new transports.File({ filename: "logs/error.log", level: "error" }));
    logger.add(new transports.File({ filename: "logs/combined.log" }));
  }

  logger.info(`Starting ${appName} application`);
  const appLogger = logger;

  appLogger.err = (error) => {
    if (error instanceof Error) {
      appLogger.error(error.stack);
    } else {
      try {
        appLogger.error(JSON.stringify(error));
      } catch (error) {
        appLogger.error(error);
      }
      if (error.err) appLogger.error(error.err.stack.toString());
    }
  };

  return appLogger;
};
