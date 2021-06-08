const sequelize = require("../../lib/sequelize");
const { DataTypes, Model } = require("sequelize");
const Article = require("./Article");

class Movie extends Model {}
Movie.init(
  {},
  {
    sequelize,
    modelName: "Movie",
    paranoid: true,
  }
);

Movie.belongsToMany(Article, {
  through: "ArticleMovie",
});

Article.belongsToMany(Movie, {
  through: "ArticleMovie",
});

module.exports = Movie;
