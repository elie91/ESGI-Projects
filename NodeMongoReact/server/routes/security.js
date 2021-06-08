const createToken = require("../lib/auth").createToken;
const express = require("express");
const router = express.Router();
const User = require("../models/sequelize/User");
const bcrypt = require("bcryptjs");

// POST
router.post("/login_check", (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    where: { username },
  })
    .then((data) => {
      if (!data) {
        return Promise.reject("invalid");
      } else {
        return bcrypt.compare(password, data.password).then((valid) => {
          if (!valid) {
            return Promise.reject("invalid");
          } else {
            return Promise.resolve(data);
          }
        });
      }
    })
    .then((user) =>
      createToken({ username: user.username }).then((token) =>
        res.json({ token })
      )
    )
    .catch((err) =>
      err === "invalid"
        ? res.status(400).json({
            username: "Invalid credentials",
            password: "Invalid credentials",
          })
        : console.error(err) || res.sendStatus(500)
    );
});

// POST
router.post("/users", (req, res) => {
  User.create(req.body)
    .then((data) => res.status(201).json(data))
    .catch((error) => {
      if (error instanceof ValidationError) {
        console.log(error.errors);
        const errors = error.errors.reduce((acc, item) => {
          acc[item.path] = [...(acc[item.path] || []), item.message];
          return acc;
        }, {});
        res.status(400).json(errors);
      } else {
        res.sendStatus(500);
      }
    });
});

module.exports = router;
