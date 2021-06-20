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
              };

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
          }).catch(() => res.sendStatus(500));
        }
      });
  }

};
