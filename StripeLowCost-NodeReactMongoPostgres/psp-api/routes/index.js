const express = require('express');
module.exports = app => {
  app.use('/', require('./payment')(app));
};
