const sequelize = require("../../lib/sequelize");
const Article = require("./Article");
const Movie = require("./Movie");
const User = require("./User");
require("./hooks");

sequelize
  .sync({ alter: true })
  .then((result) => console.log("Sync OK"))
  .catch((result) => console.error("Sync KO"));

module.exports = {
  sequelize,
  Article,
  User,
  Movie,
};
