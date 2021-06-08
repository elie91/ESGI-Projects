const sequelize = require("../../lib/sequelize");
const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const Article = require("./Article");
const Movie = require("./Movie");
const denormalize = require("./hooks/denormalizationUser");

// Generation du model
class User extends Model {}
User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email non valide",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: DataTypes.STRING,
    lastname: {
      type: DataTypes.STRING,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    paranoid: true,
  }
);

// Many to Many
// User.belongsToMany(Article) => UserArticle => User.articles
// Article.belongsToMany(User) => UserArticle =>

// One to One
// User.hasOne(Article) => User.article
// Article.hasOne(User) => Article.user

// MANY Users TO ONE Article
// User.belongsTo(Article) => User.article
// One Article TO MANY Users
// Article.hasMany(User) => Article.users

console.log("User : ", Movie, Article, denormalize, Model);
// ONE User TO MANY Articles
User.hasMany(Article); // User.articles
// MANY Articles TO ONE User
Article.belongsTo(User); // Article.user

User.belongsToMany(Movie, {
  as: "DirectedMovies",
  through: "DirectorMovie",
});

Movie.belongsToMany(User, {
  as: "Directors",
  through: "DirectorMovie",
});

User.belongsToMany(Movie, {
  as: "PlayedMovies",
  through: "ActorMovie",
});

Movie.belongsToMany(User, {
  as: "Actors",
  through: "ActorMovie",
});

User.addHook("beforeCreate", async (user, options) => {
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
});

User.addHook("afterCreate", (user) => {
  denormalize(User, user.id, "create");
});
User.addHook("afterUpdate", (user) => {
  denormalize(User, user.id, "update");
});
User.addHook("afterDestroy", (user) => {
  denormalize(User, user.id, "delete");
});

module.exports = User;
