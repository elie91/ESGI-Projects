const { Op } = require("sequelize");
module.exports = (app) => {

  const UserModel = app.sequelize.models.User;

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };

  function getUsers (req, res, next) {
    return UserModel.findAll({
      where: {
        ...app.helpers.orConditionFormatParams(req.query),
        deleted: false,
      },
    }).then((data) => {
      res.json(data);
    }).catch((err) => console.log(err) || res.sendStatus(500));
  }

  function getUser (req, res, next) {
    return UserModel.findOne({
      where: {
        id: req.params.id,
        deleted: false,
      },
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function createUser (req, res, next) {
    let includes = {};

    let object = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      birthday: req.body.birthday,
      password: req.body.password,
      image: req.body.image ? req.body.image : "",
      role: req.body.role ? req.body.role : ["ROLE_USER"],
    };

    if (req.body.player) {
      includes = {
        ...includes,
        include: [{
          association: app.relations.userPlayer,
          as: "player",
        }],
      };

      let objectP = {
        height: req.body.player.height,
        weight: req.body.player.weight,
        nationality: req.body.player.nationality,
      };

      if (req.body.player.sport){
        objectP = {
          ...objectP,
          sport_id: req.body.player.sport,
        }
      }

      if (req.body.player.position){
        objectP = {
          ...objectP,
          position_id: req.body.player.position,
        }
      }

      object = {
        ...object,
        player: objectP,
      };
    }

    if (req.body.agent) {
      includes = {
        ...includes,
        include: [{
          association: app.relations.userAgent,
          as: "agent",
        }],
      };

      object = {
        ...object,
        agent: {
          club_id: req.body.agent.club_id,
        },
      };
    }

    if (req.body.agent) {
      includes = {
        ...includes,
        include: [{
          association: app.relations.userDocuments,
          as: "documents",
        }],
      };

      object = {
        ...object,
        documents: req.body.documents.map(document => {
          return {
            name: document.name,
            type: document.type,
            base64: document.base64 ? document.base64 : "",
          };
        }),
      };
    }

    return UserModel.create({
      ...object,
    }, includes)
      .then((user) => {
        res.json(user);
      })
      .catch((error) => {
        res.status(400).json(app.helpers.prettifyValidationErrors(error));
      });
  }

  function updateUser (req, res) {
    if (req.params.id !== req.user.id.toString()) {
      res.status(403).json({ "message": "permissions-denied" });
    }
    return UserModel.update(req.body, {
      where: { id: req.params.id },
      returning: true,
      plain: true,
    })
      .then((result) => {
        result ? res.json(result[1].dataValues) : res.sendStatus(404);
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
        } else {
          res.sendStatus(500);
        }
      });
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
};
