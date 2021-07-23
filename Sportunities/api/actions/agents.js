const { QueryTypes } = require("sequelize");
module.exports = (app) => {

  const AgentModel = app.sequelize.models.Agent;
  const UserModel = app.sequelize.models.User;
  const DocumentModel = app.sequelize.models.Document;

  return {
    createAgent,
    getAgents,
    getAgent,
    updateAgent,
  };

  function createAgent (req, res, next) {

    let newItem = {
      owner_id: req.user.id,
      isConfirmed: false,
    };

    if (req.body.club) {
      newItem = {
        ...newItem,
        club: {
          name: req.body.club.name,
          country: req.body.club.country,
          postalCode: req.body.club.postalCode,
          city: req.body.club.city,
        },
      };
    } else {
      newItem = {
        ...newItem,
        club_id: req.body.club_id,
      };
    }

    return AgentModel.create(newItem, {
      include: req.body.club ? [
        {
          association: app.relations.playerClubs,
          as: "club",
        },
      ] : [],
    }).then((agent) => {

      req.body.documents.forEach(document => {
        DocumentModel.create({
          ...document,
          owner_id: req.user.id,
        })
          .catch((error) => {
            res.status(400).json(app.helpers.prettifyValidationErrors(error));
            console.log(error);
          });
      });

      return UserModel.update({
        role: ["ROLE_AGENT"],
        hasChosenRole: true,
      }, {
        where: { id: req.user.id },
        returning: true,
        plain: true,
      }).then((result) => {
        if (result) {
          let values = {
            ...result[1].dataValues,
            role: ["ROLE_AGENT"],
            agent: agent.dataValues,
          };

          delete values.image;

          app.helpers.createToken(values)
            .then((token) => {
              res.json({
                user: values,
                token,
              });
            }).catch((e) => console.log("Token", e) || res.sendStatus(500));
        } else {
          res.sendStatus(404);
        }
      }).catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
        } else {
          res.sendStatus(500);
        }
      });
    }).catch((error) => {
      res.status(400).json(app.helpers.prettifyValidationErrors(error));
    });
  }

  function getAgents (req, res, next) {
    const { limit, page, ...condition } = req.query;
    return app.helpers.searchByPage(AgentModel,
      {
        ...condition,
        ...app.helpers.orConditionFormatParams(condition),
        deleted: false,
      },
      limit,
      page,
      [
        {
          model: app.models.User,
          as: "user",
        },
        {
          model: app.models.Club,
          as: "club",
        },
      ],
      [
        ["createdAt", "DESC"],
      ],
    )
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function getAgent (req, res, next) {
    let params = {};

    if (req.owner_id) {
      params = {
        ...params,
        owner_id: req.owner_id,
      };
    }

    return AgentModel.findOne({

      where: {
        ...params,
        id: req.params.id,
        deleted: false,
      },
      include: [
        {
          model: app.models.User,
          as: "user",
          include: [
            {
              model: app.models.Document,
              as: "documents",
            },
          ],
        },
        {
          model: app.models.Club,
          as: "club",
        },
      ],
    }).then((data) => data ? res.json(data) : res.sendStatus(404))
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function updateAgent (req, res) {

    let object = {
      ...req.body,
    };

    if (req.body.club_id) {
      object = {
        ...object,
        club_id: req.body.club_id,
      };
    }

    if (req.body.documents) {
      req.body.documents.forEach(document => {
        DocumentModel.create({
          ...document,
          owner_id: req.user.id,
        })
          .catch((error) => {
            res.status(400).json(app.helpers.prettifyValidationErrors(error));
            console.log(error);
          });
      });
    }

    return AgentModel.update(object, {
      where: { id: req.params.id },
      returning: true,
      plain: true,
    })
      .then(async (result) => {
        const user = await UserModel.findOne({
          where: result[1].dataValues.owner_id,
        });

        if (req.body.confirmedAt !== null) {
          app.helpers.mercurePublish(app.config.caddy.topics.agents.put.replace(":id", result[1].dataValues.id), result[1].dataValues, "agent", "put");
        }

        result ? res.json({
          ...result[1].dataValues,
          user: user.toJSON(),
        }) : res.sendStatus(404);
      })
      .catch((err) => {
        console.log("errors", err);
        if (err.name === "ValidationError") {
          res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
        } else {
          res.sendStatus(500);
        }
      });
  }

};
