const bcrypt = require("bcryptjs");

module.exports = (app, Sequelize) => {
  const User = {
    firstname: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    birthday: {
      type: Sequelize.DATE(),
    },
    gender: {
      type: Sequelize.STRING(50),
    },
    phone: {
      type: Sequelize.STRING(15),
    },
    role: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    image: {
      type: Sequelize.TEXT,
    },
    token: {
      type: Sequelize.STRING(150),
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
    hasChosenRole: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };

  const UserModel = app.sequelize.define("User", User, {
    ...app.config.database.model,
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
    if (!options.hasOwnProperty("customOptions") || (options.hasOwnProperty("customOptions") && !options.customOptions.isFixture)) {
      app.logger.info("[platform-api][model][sequelize][User] afterCreate send mail");
      //app.helpers.sendEmailTo(user)
    }
  });

  return UserModel;
};
