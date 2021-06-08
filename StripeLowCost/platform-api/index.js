const express = require("express");
const app = express();

// Loading applicatin stack
(async () => {
    require("./config")(app);
    console.log("Loading config ...");
    require("./boot")(app);
    app.logger.info("Booting application ...");
    await require("./models")(app);
    app.logger.info("Loading models ...");
    require("./helpers")(app);
    app.logger.info("Loading helpers ...");
    require("./middlewares")(app);
    app.logger.info("Loading middlewares ...");
    require("./actions")(app);
    app.logger.info("Loading actions ...");
    require("./routes")(app);
    app.logger.info("Loading routes ...");

// Uncomment to load fixtures
    //require('./fixtures/fixtures')(app);
    app.logger.info(`App listening on http://localhost:${app.config.port}`);
    app.listen(app.config.port);
})();

