const { Op } = require("sequelize");
module.exports = (app) => {

  const ClubModel = app.sequelize.models.Club;

  return {
    getClubs,
    getClub,
    createClub,
    updateClub,
    deleteClub,
  };

  function getClubs (req, res, next) {
    const { limit, page, ...condition } = req.query;
    return app.helpers.searchByPage(ClubModel,
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

  function getClub (req, res, next) {
    return ClubModel.findOne({
      where: {
        id: req.params.id,
        deleted: false,
      },
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function createClub (req, res, next) {
    return ClubModel.build({
      name: req.body.name,
      country: req.body.country,
      postalCode: req.body.postalCode,
      city: req.body.city,
      logo: req.body.logo,
      approved: req.user.role.includes('ROLE_ADMIN'),
    })
      .save()
      .then((club) => res.json(club))
      .catch((error) => {
        console.log(error);
        res.status(400).json(app.helpers.prettifyValidationErrors(error));
      });
  }

  function updateClub (req, res) {
    return ClubModel.update(req.body, {
      where: { id: req.params.id },
      returning: true,
      plain: true,
    }).then((result) => {
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

  function deleteClub (req, res) {
    return ClubModel.update({ deleted: true }, { where: { id: req.params.id } })
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
