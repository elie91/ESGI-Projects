const { Op } = require("sequelize");
module.exports = (app) => {

  const PlayerModel = app.sequelize.models.Player;
  const VideoModel = app.sequelize.models.Video;

  return {
    search,
  };

  async function search (req, res, next) {

    const { s } = req.query;

    const players = await PlayerModel.findAll({
      include: [
        {
          model: app.models.User,
          as: "user",
          where: {
            lastname: {
              [Op.like]: "%" + s + "%",
            },
            firstname: {
              [Op.like]: "%" + s + "%",
            },
          },
        },
      ],
      limit: 15,
    }).catch(e => console.error(e));
    const videos = await VideoModel.findAll({
      where: {
        title: {
          [Op.like]: "%" + s + "%",
        },
      },
      include: [
        {
          model: app.models.User,
          as: "user",
          include: [
            {
              model: app.models.Player,
              as: "player",
            },
          ],
        },
      ],
      limit: 15,
    }).catch(e => console.error(e));
    return res.json({ videos: videos, players: players });
  }
};
