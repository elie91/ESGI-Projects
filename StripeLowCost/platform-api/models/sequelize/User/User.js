const bcrypt = require("bcryptjs");
module.exports = (app, Sequelize) => {
  const User = {
    firstname: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Email invalid" },
        notEmpty: true,
      },
    },
    phone: {
      type: Sequelize.STRING(15),
    },
    role: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };

  const UserModel = app.sequelize.define("User", User, {
    ...app.config.sequelize.model,
    /*defaultScope: {
      attributes: {
        exclude: ['password']
      }
    }*/
  });

  UserModel.addHook("beforeCreate", async (user, options) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  UserModel.addHook("afterCreate", (user, options) => {
    if( !options.hasOwnProperty('customOptions') || (options.hasOwnProperty('customOptions') && !options.customOptions.isFixture)){
      app.logger.info("[platform-api][model][sequelize][User] afterCreate send mail");
      app.helpers.sendEmailTo(user)
    }

    new app.mongoose.models.User({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      deleted: false,
    }).save()
      // .then(app.logger.info("[platform-api][model][sequelize][User] afterCreate workded"))
      .catch((err) => { app.logger.error("[platform-api][model][sequelize][User] afterCreate failed", err);});
  });

  UserModel.addHook("afterUpdate", (user, options) => {
    app.logger.info("[platform-api][model][sequelize][User] afterUpdate start");
    app.mongoose.models.User.findOne({ email: user.email })
      .then(newUser => {
        user.firstname = newUser.firstname;
        user.lastname = newUser.lastname;
        user.email = newUser.email;
        user.phone = newUser.phone;
        user.role = newUser.role;

        user.save()
          // .then(app.logger.info("[platform-api][model][sequelize][User] afterUpdate workded"))
          .catch((err) => { app.logger.error("[platform-api][model][sequelize][User] afterUpdated failed ", err);});
      });
  });

  UserModel.addHook("afterDestroy", (user, options) => {
    app.mongoose.models.User.findOne({ email: user.email })
      .then(user => {
        user.deleted = true;
        user.save()
          // .then(app.logger.info("[platform-api][model][sequelize][User] afterDestroy workded"))
          .catch((err) => { app.logger.error("[platform-api][model][sequelize][User] afterDestroy failed ", err);});
      });
  });

  return UserModel;
};
