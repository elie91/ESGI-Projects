const { Op } = require("sequelize");
module.exports = (app) => {

  const ExperienceModel = app.sequelize.models.Experience;
  const ClubModel = app.sequelize.models.Club;

  return {
    getExperiences,
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience,
  };

  function getExperiences (req, res, next) {
    return ExperienceModel.findAll({
      where: {
        ...app.helpers.orConditionFormatParams(req.query),
        deleted: false,
      },
    }).then((data) => {
      res.json(data);
    }).catch((err) => console.log(err) || res.sendStatus(500));
  }

  function getExperience (req, res, next) {
    return ExperienceModel.findOne({
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

  function createExperience (req, res, next) {

    let newItem = {
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      position_id: req.body.position,
      player_id: req.user.player.id,
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

    return ExperienceModel.build(newItem, {
      include: req.body.club ? [
        {
          association: app.relations.experienceClubs,
          as: "club",
        },
      ] : [],
    }).save().then((experience) => {
      experience.getPosition().then(position => {
        experience.getClub().then(club => {
          res.json({
            ...experience.dataValues,
            position: position,
            club: club,
          });
        }).catch(e => res.status(500).json(e));
      }).catch(e => res.status(500).json(e));
    }).catch((error) => {
      res.status(400).json(app.helpers.prettifyValidationErrors(error));
    });
  }

  function updateExperience (req, res) {

    let newItem = {
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      position_id: req.body.position,
      club_id: req.body.club_id,
    };

    return ExperienceModel.update(newItem, {
      where: { id: req.params.id },
      returning: true,
      plain: true,
    }).then((result) => {

      if (result) {
        result[1].getPosition().then(position => {
          result[1].getClub().then(club => {
            res.json({
              ...result[1].dataValues,
              position: position,
              club: club,
            });
          }).catch(e => res.status(500).json(e));
        }).catch(e => res.status(500).json(e));
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

  function deleteExperience (req, res) {
    return ExperienceModel.destroy({
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
