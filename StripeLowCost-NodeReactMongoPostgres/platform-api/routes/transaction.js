const Router = require("express").Router;

module.exports = (app) => {

    const router = new Router();

    router.get("/group-by-date",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.transaction.groupByDate
    );

    router.get("/amount-per-date",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.transaction.amountByDate
    );

    router.get("/search",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.transaction.search
    );

    router.get("/",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.transaction.cget
    );

    router.post("/",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.transaction.post
    );

    router.get("/:id",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.transaction.get
    );

    router.put("/:id",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.transaction.put
    );

    router.delete("/:id",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.transaction.remove
    );

    router.post("/refund",
        app.actions.transaction.refund
    );

    return router;
};
