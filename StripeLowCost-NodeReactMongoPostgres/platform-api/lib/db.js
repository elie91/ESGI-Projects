const mongoose = require("mongoose");

mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@mongo`, {
  dbName: process.env.MONGODB_DBNAME,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(
  resolve => console.log("mongo connected"),
  reject => console.log(reject),
);

module.exports = mongoose.connection;
