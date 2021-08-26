module.exports = app => {
  app.actions = {
    payment: require('./payment')(app), // Load your action
  };
};
