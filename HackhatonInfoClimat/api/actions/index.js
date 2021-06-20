module.exports = app => {
  app.actions = {
    root: require('./root')(app),
    stations: require('./stations')(app),
    users: require('./users')(app),
    security: require('./security')(app),
    historicEvents: require('./historic_events')(app)
  };
};
