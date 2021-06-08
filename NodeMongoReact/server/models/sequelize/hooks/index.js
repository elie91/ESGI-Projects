const denormalize = require("./denormalizationUser");
const Article = require("../Article");
const Movie = require("../Movie");
const User = require("../User");

const onHookMovie = (movie) => {
  movie.Actors.forEach((actor) => {
    denormalize(User, actor.id);
  });
  movie.Directors.forEach((director) => {
    denormalize(User, director.id);
  });
};
Movie.addHook("afterCreate", onHookMovie);
Movie.addHook("afterUpdate", onHookMovie);
Movie.addHook("afterDestroy", onHookMovie);

const onHookArticle = (article) => denormalize(User, article.user.id);
Article.addHook("afterCreate", onHookArticle);
Article.addHook("afterUpdate", onHookArticle);
Article.addHook("afterDestroy", onHookArticle);
