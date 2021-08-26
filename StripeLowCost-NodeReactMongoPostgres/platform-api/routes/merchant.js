const Router = require("express").Router;

module.exports = (app) => {

    const router = new Router();

    router.get("/check_credentials",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.merchant.validCredentials
    );

    router.get("/",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.merchant.getAll
    );

    router.get("/:id",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.merchant.getById
    );

    router.put("/:id",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.merchant.put
    );

    router.put("/:id/keys",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.merchant.generateKeys
    );

    router.get("/:id/transactions",
        app.middlewares.verifyToken(app, ['ADMIN', 'MERCHANT']),
        app.actions.merchant.getMerchantTransactions
    );

    return router;
};
