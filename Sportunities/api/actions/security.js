const bcrypt = require("bcryptjs");

module.exports = app => {
  const User = app.sequelize.models.User;

  return {
    login,
  };

  function login (req, res) {

    return User
      .findOne({
        where: { email: req.body.email },
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
      }).then(user => {
        if (!user) {
          res.status(401).json("security.invalid.credentials");
        } else {
          bcrypt.compare(req.body.password, user.password).then((result) => {

            if (result) {
              let object = {
                id: user.id,
                lastname: user.lastname,
                firstname: user.firstname,
                email: user.email,
                phone: user.phone,
                role: user.role,
                hasChosenRole: user.hasChosenRole,
              };

              if (user.role.includes("ROLE_PLAYER")) {
                let player = user.player.dataValues;
                delete player.banner;

                object = {
                  ...object,
                  player,
                };
              }

              if (user.role.includes("ROLE_AGENT")) {
                object = {
                  ...object,
                  agent: user.agent.dataValues,
                };
              }

              app.helpers.createToken(object)
                .then((token) => {
                  object = {
                    ...object,
                    token,
                  };
                  res.json(object);
                }).catch(() => res.sendStatus(500));
            } else {
              res.status(401).json("security.invalid.credentials");
            }
          }).catch((e) => console.log(e) || res.sendStatus(500));
        }
      });
  }

};
