const Mongoose = require("mongoose");
module.exports = app => new Promise((resolve, reject) => {
    app.mongoose = {};
    Mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@mongo`, {
        dbName: process.env.MONGODB_DBNAME,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((connect)=>{

        app.mongoose.schemas = {};
        app.mongoose.schemas.TransactionStatus = require("./Purchase/TransactionStatus")(app, Mongoose);
        app.mongoose.schemas.Transaction = require("./Purchase/Transaction")(app, Mongoose);
        app.mongoose.schemas.Merchant = require("./User/Merchant")(app, Mongoose);
        app.mongoose.schemas.User = require("./User/User")(app, Mongoose);

        app.mongoose.models = {
            Currency: connect.model("Currency", require("./Purchase/Currency")(Mongoose)),
            Merchant: connect.model("Merchant", require("./User/Merchant")(app, Mongoose)),
            User: connect.model("User", require("./User/User")(app, Mongoose)),
            TransactionStatus: connect.model("Transaction_status", require("./Purchase/TransactionStatus")(app, Mongoose)),
            Transaction: connect.model("Transaction", require("./Purchase/Transaction")(app, Mongoose)),
        };


        app.logger.info(
            "[platform-api][model][mongoose] Connection has been established successfully!",
        );
        resolve();

    }).catch(err => {
        console.log(err);
        app.logger.error("[platform-api][model][mongoose] Unable to connect to the database:", err);
    });
});
