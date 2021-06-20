module.exports = app => {
  app.use('/', require('./root')(app));
  app.use('/stations', require('./stations')(app));
  app.use('/users', require('./users')(app));
  app.use('/', require('./security')(app));
  app.use('/historic-events', require('./historic_events')(app));
};

