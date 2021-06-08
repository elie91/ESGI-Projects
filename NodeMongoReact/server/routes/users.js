const express = require("express");
const User = require("../models/sequelize/User");
const { ValidationError, Op } = require("sequelize");
const verifyToken = require("../middlewares/verifyToken");
const { Article } = require("../models/sequelize");
const router = express.Router();

// CGET
router.get("/", (req, res) => {
  const { username, article: articleConditions, ...conditions } = req.query;
  if (username) {
    conditions.username = { [Op.startsWith]: req.query.username };
  }
  console.log(conditions);

  User.findAll({
    where: conditions,
    paranoid: false,
    include: [
      {
        model: Article,
        where: articleConditions,
      },
    ],
  })
    .then((data) => res.json(data))
    .catch((err) => res.sendStatus(500));
});

// GET
router.get("/:id", (req, res) => {
  User.findByPk(req.params.id)
    .then((data) => (data ? res.json(data) : res.sendStatus(404)))
    .catch((err) => res.sendStatus(500));
});

// PUT
router.put("/:id", (req, res) => {
  User.update(req.body, { returning: true, where: { id: req.params.id } })
    .then(([nbUpdated, result]) =>
      nbUpdated ? res.json(result[0]) : res.sendStatus(404)
    )
    .catch((error) => {
      if (error instanceof ValidationError) {
        console.log(error.errors);
        const errors = error.errors.reduce((acc, item) => {
          acc[item.path] = [...(acc[item.path] || []), item.message];
          return acc;
        }, {});
        res.status(400).json(errors);
      } else {
        console.log(error);
        res.sendStatus(500);
      }
    });
});

// DELETE
router.delete("/:id", (req, res) => {
  User.destroy({
    where: { id: req.params.id },
  })
    .then((data) => (data ? res.sendStatus(204) : res.sendStatus(404)))
    .catch((err) => res.sendStatus(500));
});

module.exports = router;
