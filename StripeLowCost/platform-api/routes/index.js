module.exports = app => {
  app.use('/', require('./auth')(app));
  app.use('/users', require('./user')(app));
  app.use('/transactions', require('./transaction')(app));
  app.use('/merchants', require('./merchant')(app));
  app.use('/', require('./root')(app));
  app.use('/', require('./payment')(app));
  app.use('/currencies', require('./currency')(app));
};
