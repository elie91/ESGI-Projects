module.exports = app => {
  app.actions = {
    root: require('./root')(app),
    users: require('./users')(app),
    sports: require('./sports')(app),
    positions: require('./positions')(app),
    conversations: require('./conversations')(app),
    messages: require('./messages')(app),
    security: require('./security')(app),
    clubs: require('./clubs')(app),
    tags: require('./tags')(app),
    players: require('./players')(app),
    agents: require('./agents')(app),
    documents: require('./documents')(app),
    experiences: require('./experiences')(app),
    videos: require('./videos')(app),
    search: require('./search')(app),
  };
};
