const Router = require('express').Router;

module.exports = (app) => {
  let router = new Router();

  router.get("/filteredvalues",
    app.actions.historicEvents.getHistoricEventsFiltered
  );

  router.get("/",
      app.actions.historicEvents.getHistoricEvents
  );

  router.get("/:id",
      app.actions.historicEvents.getHistoricEvent
  );

  router.get("/:id/values",
      app.actions.historicEvents.getHistoricEventsValues
  );

  return router;
};
