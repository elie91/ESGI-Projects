module.exports = (app, Sequelize) => {
  const Video = {
    title: {
      type: Sequelize.STRING(250),
      allowNull: false,
    },
    filename: {
      type: Sequelize.STRING(250),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    url: {
      type: Sequelize.STRING(250),
      allowNull: true,
    },
    thumbnail: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    deleted: {
      type: Sequelize.BOOLEAN(),
      defaultValue: false,
      allowNull: false,
    },
  };

  const VideoModel = app.sequelize.define("Video", Video, {
    ...app.config.database.model
  });

  return VideoModel;
};
