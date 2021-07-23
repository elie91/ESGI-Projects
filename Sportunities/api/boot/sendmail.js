const nodemailer = require('nodemailer');

module.exports = (app) => {
  if (app.transporter) return app.transporter;
  const transporter = nodemailer.createTransport(app.config.smtpConfig);
  transporter.verify((error) => {
    if (error) {
      app.logger.error(error);
    } else {
      app.logger.info('[mailer] Server is ready to take our messages !');
    }
  });
  return transporter;
};
