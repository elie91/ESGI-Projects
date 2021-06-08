const mongoose = require("mongoose");
const db = require("../lib/db");

const Schema = new mongoose.Schema(
  {
    Category: String,
    Length: {
      type: Number,
      default: 0,
    },
    Title: String,
  },
  {
    collection: "Sakila_films",
  }
);

const SakilaFilm = db.model("SakilaFilm", Schema);

module.exports = SakilaFilm;
