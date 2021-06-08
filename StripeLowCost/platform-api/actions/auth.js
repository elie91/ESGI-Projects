const bcrypt = require("bcryptjs");

module.exports = app => {
  const User = app.sequelize.models.User;
  const Merchant = app.sequelize.models.Merchant;

  return {
    login,
  };

  function login (req, res) {
    return User
      .findOne({
        where: { email: req.body.email },
        include: [{
          model: Merchant,
          as: 'merchant',
        }],
      })
      .then(user => {
        if (!user) {
          res.status(401).json({
            username: "Invalid credentials",
            password: "Invalid credentials",
          });
        } else {
          bcrypt.compare(req.body.password, user.password).then((result) => {
            if (result) {
              app.helpers.createToken({
                id: user.id,
                lastname: user.lastname,
                firstname: user.firstname,
                email: user.email,
                phone: user.phone,
                role: user.role,
              })
                .then((token) => res.json({
                  id: user.id,
                  lastname: user.lastname,
                  firstname: user.firstname,
                  email: user.email,
                  phone: user.phone,
                  role: user.role,
                  merchants: user.merchant,
                  token,
                }))
                .catch(() => res.sendStatus(500));
            } else {
              res.status(401).json({
                username: "Invalid credentials",
                password: "Invalid credentials",
              });
            }
          })
            .catch(() => res.sendStatus(500));
        }
      });
  }
};
