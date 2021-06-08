const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    username: String,
    firstname: String,
    lastname: String,
    confirmed: Boolean,
    Articles: Array,
    DirectedMovies: Array,
    PlayedMovies: Array
  },
  {
    collection: "Users",
  }
);

const User = mongoose.model("User", Schema);

module.exports = User;
