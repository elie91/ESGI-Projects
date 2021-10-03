module.exports = (app, Sequelize) => {
  const Conversation = {
    viewedAt: {
      type: Sequelize.DATE,
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };


  return app.sequelize.define("Conversation", Conversation, {
    ...app.config.database.model,
    indexes: [
      {
        unique: true,
        fields: ["receiver_id", "sender_id"],
      },
    ],
  });
};
