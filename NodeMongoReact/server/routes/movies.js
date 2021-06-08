const express = require("express");
const SakilaFilm = require("../models/SakilaFilm");

const router = express.Router();

// CGET
router.get("/", (req, res) => {
  SakilaFilm.find(req.query).then((data) => res.json(data));
});

// POST
router.post("/", (req, res) => {
  const movie = new SakilaFilm(req.body);
  movie.save().then((data) => res.status(201).json(movie));
});

// GET
router.get("/:id", (req, res) => {
  SakilaFilm.findById(req.params.id).then((data) => res.json(data));
});

// PUT
router.put("/:id", (req, res) => {
  SakilaFilm.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).then((data) => res.json(data));
});

// DELETE
router.delete("/:id", (req, res) => {
  SakilaFilm.findByIdAndDelete(req.params.id).then(() => res.sendStatus(204));
});

module.exports = router;
