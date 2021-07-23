const { Op } = require("sequelize");
module.exports = (app) => {

  const SportModel = app.sequelize.models.Sport;

  return {
    getSports,
    getSport,
    createSport,
    updateSport,
    deleteSport,
  };

  function getSports(req, res, next) {
    const { limit, page, ...condition } = req.query;
    return app.helpers.searchByPage(SportModel,
      {
        ...app.helpers.orConditionFormatParams(condition),
        deleted: false
      },
      limit,
      page
    )
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function getSport(req, res, next) {
    return SportModel.findOne({
      where: {
        id: req.params.id,
        deleted: false,
      },
      include: {
        model: app.models.Position,
        as: "position"
      }
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function createSport(req, res, next) {
    return SportModel.build({
      name: req.body.name,
      description: req.body.description,
      color: req.body.color,
      image: req.body.image,
    })
      .save()
      .then((sport) => res.json(sport))
      .catch((error) => {
        console.log(error);
        res.status(400).json(app.helpers.prettifyValidationErrors(error));
      });
  }

  function updateSport(req, res) {
    return SportModel.update(req.body, {
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

  function deleteSport(req, res) {
    return SportModel.update({ deleted: true }, { where: { id: req.params.id } })
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
