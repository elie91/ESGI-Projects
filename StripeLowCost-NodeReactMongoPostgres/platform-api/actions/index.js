module.exports = app => {
  app.actions = {
    auth: require('./auth')(app), // Load your action
    root: require('./root')(app), // Load your action
    user: require('./user')(app), // Load your action
    transaction: require('./transaction')(app),
    merchant: require('./merchant')(app),
    payment: require('./payment')(app),
    currency: require('./currency')(app),
  };
};
