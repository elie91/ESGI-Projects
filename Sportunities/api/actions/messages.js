module.exports = (app) => {

  const MessageModel = app.sequelize.models.Message;

  return {
    getMessages,
    getMessage,
    createMessage,
    updateMessage,
    deleteMessage,
  };

  function getMessages (req, res, next) {
    return MessageModel.findAll({
      where: {
        ...req.query,
        //...app.helpers.orConditionFormatParams(req.query),
      },
      order: [
        ["updatedAt", "DESC"],
      ],
      include: [
        {
          model: app.models.User,
          as: "userSender",
        },
      ],

    }).then((data) => {
      res.json(data);
    }).catch((err) => console.log(err) || res.sendStatus(500));
  }

  function getMessage (req, res, next) {
    return MessageModel.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function createMessage (req, res, next) {
    return MessageModel.build({
      content: req.body.content,
      owner: req.body.owner,
      conversation_id: req.body.conversation,
    })
      .save()
      .then((message) => {
        app.models.Conversation.findOne({
          where: {
            id: message.conversation_id,
          },
        }).then((result) => {
          app.helpers.mercurePublish(app.config.caddy.topics.messages.post.replace(":id", req.user.role.includes("ROLE_PLAYER") ? result.sender_id : result.receiver_id), {
            ...message.dataValues,
            conversation: result,
          }, "message", "post");
          return res.json(message);
        }).catch((err) => console.log(err) || res.sendStatus(500));

      })
      .catch((error) => {
        res.status(400).json(app.helpers.prettifyValidationErrors(error));
      });
  }

  function updateMessage (req, res) {
    return MessageModel.update(req.body, {
      where: { id: req.params.id },
      returning: true,
      plain: true,
    })
      .then((message) => {
        if (message) {
          const data = message[1].dataValues;
          app.models.Conversation.findOne({
            where: {
              id: data.conversation_id,
            },
          }).then((conversation) => {
            app.helpers.mercurePublish(app.config.caddy.topics.messages.post.replace(":id", req.user.role.includes("ROLE_PLAYER") ? conversation.sender_id : conversation.receiver_id), {
              ...data,
            }, "message", "put");
            res.json(data);
          }).catch((err) => console.log(err) || res.sendStatus(500));
        } else {
          res.sendStatus(404);
        }
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
        } else {
          res.sendStatus(500);
        }
      });
  }

  function deleteMessage (req, res) {

    return MessageModel.update({ deleted: true }, { where: { id: req.params.id, owner: req.user.id } })
      .then((data) => {
        if (data) {
          MessageModel.findOne({
            where: {
              id: req.params.id,
              owner: req.user.id,
            },
            include: {
              model: app.models.Conversation,
              as: "conversation",
            },
          }).then((result => {
            const object = {
              id: result.id,
              conversation: result.conversation_id,
            };
            app.helpers.mercurePublish(app.config.caddy.topics.messages.post.replace(":id", req.user.role.includes("ROLE_PLAYER") ? result.conversation.sender_id : result.conversation.receiver_id),
              object, "message", "delete");
            res.json(object);
          })).catch((err) => console.log(err) || res.sendStatus(500));

        } else {
          res.sendStatus(404);
        }
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
        } else {
          res.sendStatus(500);
        }
      });
  }
};
