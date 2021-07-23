module.exports = (app) => {

  const PositionModel = app.sequelize.models.Position;

  return {
    getPositions,
    getPosition,
    createPosition,
    updatePosition,
    deletePosition,
  };

  function getPositions (req, res, next) {
    const { limit, page, ...condition } = req.query;
    console.log(condition);
    return app.helpers.searchByPage(PositionModel,
      {
        ...condition,
        //...app.helpers.orConditionFormatParams(condition),
      },
      limit,
      page,
      [{
        model: app.models.Sport,
        as: "sport",
      }],
    )
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function getPosition (req, res, next) {
    return PositionModel.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function createPosition (req, res, next) {
    return PositionModel.build({
      value: req.body.value,
      sport_id: req.body.sport_id,
    })
      .save()
      .then((position) => res.json(position))
      .catch((error) => {
        console.log(error);
        res.status(400).json(app.helpers.prettifyValidationErrors(error));
      });
  }

  function updatePosition (req, res) {
    return PositionModel.update(req.body, {
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

  function deletePosition (req, res) {
    return PositionModel.destroy({
      where: {
        id: req.params.id,
      },
    }).then(() => {
        res.sendStatus(204);
      }).catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
        } else {
          res.sendStatus(500);
        }
      });
  }
};
