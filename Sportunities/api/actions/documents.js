const { Op } = require("sequelize");
module.exports = (app) => {

  const DocumentModel = app.sequelize.models.Document;

  return {
    getDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
  };

  function getDocuments(req, res, next) {
    const { limit, page, ...condition } = req.query;
    return app.helpers.searchByPage(DocumentModel,
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

  function getDocument(req, res, next) {
    return DocumentModel.findOne({
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

  function createDocument(req, res, next) {
    return DocumentModel.build({
      name: req.body.name,
      base64: req.body.base64,
      type: req.body.type,
    })
      .save()
      .then((sport) => res.json(sport))
      .catch((error) => {
        console.log(error);
        res.status(400).json(app.helpers.prettifyValidationErrors(error));
      });
  }

  function updateDocument(req, res) {
    return DocumentModel.update(req.body, {
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

  function deleteDocument(req, res) {
    return DocumentModel.update({ deleted: true }, { where: { id: req.params.id } })
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
