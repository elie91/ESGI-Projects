module.exports = (app) => {

  const ConversationModel = app.sequelize.models.Conversation;

  return {
    getConversations,
    getConversation,
    createConversation,
    deleteConversation,
  };

  function getConversations (req, res, next) {

    let params = {};

    if (req.user.role.includes("ROLE_AGENT")) {
      params = {
        ...params,
        sender_id: req.user.id,
      };
    }

    if (req.user.role.includes("ROLE_PLAYER")) {
      params = {
        ...params,
        receiver_id: req.user.id,
      };
    }

    return ConversationModel.findAll({
      where: {
        ...params,
        deleted: false,
        //...app.helpers.orConditionFormatParams(req.query),
      },
      order: [
        ["updatedAt", "DESC"],
        ["messages", "updatedAt", "ASC"]
      ],
      include: [
        {
          model: app.models.Message,
          as: "messages",
          /*where: {
            deleted: false,
          },*/
        },
        {
          model: app.models.User,
          as: "userSender",
        },
        {
          model: app.models.User,
          as: "userReceiver",
        },
      ],

    }).then((data) => {
      res.json(data);
    }).catch((err) => console.log(err) || res.sendStatus(500));
  }

  function getConversation (req, res, next) {
    return ConversationModel.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function createConversation (req, res, next) {
    return ConversationModel.build({
      sender_id: req.user.id,
      receiver_id: req.body.receiver,
    })
      .save()
      .then((conversation) => {

        Promise.all([
          app.models.User.findOne({
            where: {
              id: conversation.sender_id,
            },
          }),
          app.models.User.findOne({
            where: {
              id: conversation.receiver_id,
            },
          }),
        ]).then((result) => {

          const object = {
            ...conversation.dataValues,
            userReceiver: result[1],
            userSender: result[0],
          };
          app.helpers.mercurePublish(app.config.caddy.topics.conversations.post.replace(":id", conversation.receiver_id), object, "conversation", "post");
          return res.json(object);
        }).catch((err) => console.log(err) || res.sendStatus(500));

      })
      .catch((error) => {
        console.log(error);
        res.status(400).json(app.helpers.prettifyValidationErrors(error));
      });
  }

  function deleteConversation (req, res) {
    return ConversationModel.update({ deleted: true }, { where: { id: req.params.id } })
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
