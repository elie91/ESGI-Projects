const Router = require('express').Router;

module.exports = (app) => {
  let router = new Router();

  router.get("/graph/:stationId/:climatoDate",
    app.actions.stations.getStationsGraph
  );

  router.get("/",
    app.actions.stations.getStations
  );

  return router;
};
