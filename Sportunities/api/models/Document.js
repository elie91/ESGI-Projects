module.exports = (app, Sequelize) => {
  const Document = {
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    base64: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };

  const DocumentModel = app.sequelize.define("Document", Document, {
    ...app.config.database.model,
  });


  return DocumentModel;
};
