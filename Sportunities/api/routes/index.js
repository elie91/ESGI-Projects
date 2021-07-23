module.exports = app => {
  app.use('/', require('./root')(app));
  app.use('/users', require('./users')(app));
  app.use('/sports', require('./sports')(app));
  app.use('/positions', require('./positions')(app));
  app.use('/conversations', require('./conversations')(app));
  app.use('/messages', require('./messages')(app));
  app.use('/clubs', require('./clubs')(app));
  app.use('/tags', require('./tags')(app));
  app.use('/videos', require('./videos')(app));
  app.use('/players', require('./players')(app));
  app.use('/agents', require('./agents')(app));
  app.use('/experiences', require('./experiences')(app));
  app.use('/agents', require('./agents')(app));
  app.use('/search', require('./search')(app));
  app.use('/', require('./security')(app));
};

