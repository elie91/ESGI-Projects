const { Op } = require("sequelize");
module.exports = (app) => {

  const UserModel = app.sequelize.models.User;

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserFollows
  };

  function getUsers (req, res, next) {

    const { limit, page, ...condition } = req.query;
    return app.helpers.searchByPage(UserModel,
      {
        ...app.helpers.orConditionFormatParams(condition),
        deleted: false,
      },
      limit,
      page,
    )
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function getUser (req, res, next) {
    return UserModel.findOne({
      where: {
        id: req.params.id,
        deleted: false,
      },
      include: [
        {
          model: app.models.Player,
          as: "player",
        },
        {
          model: app.models.Agent,
          as: "agent",
        },
        {
          model: app.models.Document,
          as: "documents",
        },
      ],
    }).then((data) => {
      res.json(data);
    })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function createUser (req, res, next) {

    return UserModel.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      birthday: req.body.birthday,
      password: req.body.password,
      image: req.body.image ? req.body.image : "",
      role: ["ROLE_USER"],
    }).then((user) => {
      res.json(user);
    }).catch((error) => {
      res.status(400).json(app.helpers.prettifyValidationErrors(error));
    });
  }

  function updateUser (req, res) {

    if (req.params.id !== req.user.id.toString()) {
      res.status(403).json({ "message": "permissions-denied" });
    }

    return UserModel.findOne({
      where: {
        id: req.params.id,
        deleted: false,
      },
      include: [
        {
          model: app.models.Player,
          as: "player",
        },
        {
          model: app.models.Agent,
          as: "agent",
        },
      ],
    }).then((currentUser) => {
      let object = {};

      if (req.body.currentPassword) {
        bcrypt.compare(req.body.currentPassword, currentUser.password).then(() => {
          object = {
            password: req.body.plainPassword,
            confirmPassword: req.body.confirmPassword,
          };
        }).catch(() => res.status(401).json("security.invalid.credentials"));
      } else {
        object = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone,
          gender: req.body.gender,
          password: req.body.password,
          hasChosenRole: req.body.hasChosenRole,
        };

        if (req.body.image) {
          object = {
            ...object,
            image: req.body.image,
          };
        }

        if (req.body.role) {
          object = {
            ...object,
            role: req.body.role,
          };
        }
      }

      return UserModel.update(object, {
        where: { id: req.params.id },
        returning: true,
        plain: true,
      }).then((result) => {
        let object = {
          ...result[1].dataValues,
        };
        if (currentUser.player) {
          object = {
            ...object,
            player: currentUser.player,
          };
        }

        if (currentUser.agent) {
          object = {
            ...object,
            agent: currentUser.agent,
          };
        }
        result ? res.json(object) : res.sendStatus(404);
      }).catch((err) => {
        console.log(err);
        if (err.name === "ValidationError") {
          res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
        } else {
          res.sendStatus(500);
        }
      });
    }).catch(() => res.sendStatus(404));
  }

  function deleteUser (req, res) {
    return UserModel.update({ deleted: true }, { where: { id: req.params.id } })
      .then((data) => (data ? res.json(data) : res.sendStatus(404)))
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
        } else {
          res.sendStatus(500);
        }
      });
  }

  async function getUserFollows (req, res) {
    const currentUser = await UserModel.findOne({
      where: {id: req.user.id}
    });
    const follows = await currentUser.getFollow();
    return res.status(200).json({follows})
  }
};
