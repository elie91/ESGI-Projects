module.exports = (app) => {

  const fs = require("fs");
  const VideoModel = app.sequelize.models.Video;
  const CommentModel = app.sequelize.models.Comment;
  const ViewModel = app.sequelize.models.View;
  const UserModel = app.sequelize.models.User;
  const LikeModel = app.sequelize.models.Like;
  const TagModel = app.sequelize.models.Tag;
  const SportModel = app.sequelize.models.Sport;

  return {
    getVideos,
    getVideosFollowed,
    getVideo,
    createVideo,
    deleteVideo,
    updateVideo,
    startStreaming,
    commentVideo,
    getVideoComments,
    addVideoView,
    likeVideo,
    followPlayer,
  };

  function getVideos(req, res, next) {
    const { page, limit } = req.query;
    let attributes = [];
    let order = ["createdAt", "DESC"];
    if (req.user) {
      attributes = [
        [
          app.sequelize.literal(`(SELECT COUNT(*) FROM public."Like" AS cl WHERE cl.owner_id = '${req.user.id}' AND cl.deleted = false AND "Video".id = cl.video_id)`), "hasLiked",
        ],
        [
          app.sequelize.literal(`(SELECT COUNT(*) FROM public."Follow" AS fo LEFT JOIN public."Player" AS p ON fo.player_id = p.id WHERE fo.user_id = '${req.user.id}' AND p.owner_id = "Video".owner_id)`), "hasFollowed",
        ],
      ];
    }
    switch (req.query.order) {
      case "likes":
        order = [app.sequelize.literal(`"likesCount" DESC`)];
        break;
      case "views":
        order = [app.sequelize.literal(`"viewsCount" DESC`)];
        break;
      case "date":
        order = ["createdAt", "DESC"];
        break;
    }
    return VideoModel.findAndCountAll({
      attributes: {
        include: [
          ...attributes,
          [
            app.sequelize.literal(`(SELECT COUNT(*) FROM public."Like" AS cl WHERE cl.deleted = false AND "Video".id = cl.video_id)`), "likesCount",
          ],
          [
            app.sequelize.literal(`(SELECT COUNT(*) FROM public."View" AS cv WHERE cv.deleted = false AND "Video".id = cv.video_id)`), "viewsCount",
          ],
        ],
      },
      where: {
        //...app.helpers.orConditionFormatParams(req.query),
        ...app.helpers.ownerParam(req.query),
      },
      distinct: true,
      order: [order],
      include: [
        {
          model: app.models.Sport,
          as: "sport",
          where: req.query?.sport ? { name: req.query.sport } : {},
        },
        {
          model: app.models.Like,
          as: "likes",
        },
        {
          model: app.models.Comment,
          as: "comments",
        },
        {
          model: app.models.View,
          as: "views",
        },
        {
          association: app.relations.videoTags,
          as: "tags",
        },
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
      ...app.helpers.getLimitAndOffset(page, limit),
    })
      .then(async (videos) => {
        res.json(videos);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  async function getVideosFollowed(req, res, next) {
    const { page } = req.query;

    const attributes = {
      include: [
        [
          app.sequelize.literal(`(SELECT COUNT(*) FROM public."Like" AS cl WHERE cl.owner_id = '${req.user.id}' AND cl.deleted = false AND "Video".id = cl.video_id)`), "hasLiked",
        ],
        [
          app.sequelize.literal(`(SELECT COUNT(*) FROM public."Follow" AS fo LEFT JOIN public."Player" AS p ON fo.player_id = p.id WHERE fo.user_id = '${req.user.id}' AND p.owner_id = "Video".owner_id)`), "hasFollowed",
        ],
      ],
    };

    const currentUser = await UserModel.findOne({
      where: { id: req.user.id },
    });

    const currentUserFollows = await currentUser.getFollow();
    const playersFollowed = currentUserFollows.map(follow => follow.id);

    return VideoModel.findAndCountAll({
      attributes: attributes,
      where: {
        ...app.helpers.orConditionFormatParams(req.query),
        ...app.helpers.ownerParam(req.query),
        owner_id: {
          [app.helpers.operators.in]: playersFollowed,
        },
      },
      distinct: true,
      order: [
        ["createdAt", "DESC"],
      ],
      include: [
        {
          model: app.models.Like,
          as: "likes",
        },
        {
          model: app.models.Comment,
          as: "comments",
        },
        {
          model: app.models.View,
          as: "views",
        },
        {
          association: app.relations.videoTags,
          as: "tags",
        },
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
      offset: (!page || page === 1) ? 0 : (page - 1) * 25,
      limit: 25,

    })
      .then(async (videos) => {
        res.json(videos);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  async function getVideo(req, res, next) {
    //Find the video
    const video = await VideoModel.findOne({
      where: {
        id: req.params.id,
        deleted: false,
      },
      include: [
        {
          model: app.models.Like,
          as: "likes",
        },
        {
          association: app.relations.videoComments,
          as: "comments",
        },
        {
          model: app.models.View,
          as: "views",
        },
        {
          association: app.relations.videoTags,
          as: "tags",
        },
        {
          association: app.relations.videoUsers,
          as: "owner_id",
        },
      ],
    });

    let hasLiked = false;
    let hasFollowed = false;

    if (req.user) {
      const isLiked = await LikeModel.findOne({
        where: {
          owner_id: req.user.id,
          video_id: video.id,
        },
      });

      if (isLiked) {
        hasLiked = true;
      }

      const currentUser = await UserModel.findOne({
        where: { id: req.user.id },
      });

      const isFollowed = await currentUser.getFollow({ where: { id: video.user.id } });

      if (isFollowed.length > 0) {
        hasFollowed = true;
      }
    }
    const videoObject = video.toJSON(); // actually returns a plain object, not a JSON string
    videoObject.hasLiked = hasLiked;
    videoObject.hasFollowed = hasFollowed;
    res.status(200).json(videoObject);

  }

  async function getVideoComments(req, res, next) {
    const { id } = req.params;
    const { page } = req.query;
    const comments = await CommentModel.findAndCountAll({
      where: {
        video_id: id,
      },
      order: [["createdAt", "DESC"]],
      include: [{
        model: app.models.User,
        as: "user",
      }],
      offset: (!page || page === 1) ? 0 : (page - 1) * 30,
      limit: 30,
    });
    res.status(200).json(comments);
  }

  async function createVideo(req, res, next) {

    const videoFile = req.files[0];
    const videoData = JSON.parse(req.body["videoInfos"]);

    if (!videoFile || !videoData) {
      res.status(400).json(app.helpers.prettifyValidationErrors("video.required"));
    }

    const fileContent = fs.readFileSync(videoFile.path);
    const filename = `${new Date().getTime()}-${videoFile.originalname}`;

    res.success(true);

    try {
      const location = await app.helpers.uploadToS3(filename, fileContent);
      const tags = [];
      videoData.tags.forEach(tag => {
        tags.push(TagModel.findOrCreate({ where: { name: tag.label } }));
      });
      let videoTags = await Promise.all(tags);
      videoTags = videoTags.map(tag => tag[0].id);

      const video = await VideoModel.create({
        title: videoData.title,
        filename: filename,
        description: videoData.description,
        url: location,
        owner_id: req.user.id,
      });

      await video.addTags(videoTags);

      const sport = await SportModel.findOne({ where: { "id": +videoData.sport } });
      if (sport) {
        video.setSport(sport.id);
      } else {
        next()
      }

      fs.unlinkSync(videoFile.path);
      app.helpers.mercurePublish(app.config.caddy.topics.videos.post.replace(":id", req.user.id), {
        upload: "end",
        video: video.dataValues,
      }, "video", "post");

      next();
    } catch (err) {
      app.helpers.mercurePublish(app.config.caddy.topics.videos.post.replace(":id", req.user.id), {
        upload: "error",
        err,
      }, "video", "post");
      next();
    }

  }

  async function updateVideo(req, res, next) {

    const transaction = await app.sequelize.transaction();
    try {
      const video = await VideoModel.findOne({
        where: {
          id: req.params.id,
          deleted: false,
        },
        include: [
          {
            association: app.relations.videoSports,
            as: "sport",
          },
          {
            association: app.relations.videoTags,
            as: "tags",
          },
        ],
      });
      await video.removeTags(video.tags, { transaction });
      const tags = [];
      req.body.tags.forEach(tag => {
        tags.push(TagModel.findOrCreate({ where: { name: tag.label } }));
      });
      let videoTags = await Promise.all(tags);
      videoTags = videoTags.map(tag => tag[0].id);
      await video.addTags(videoTags, { transaction });
      video.setSport(+req.body.sport);
      return VideoModel.update(req.body, {
        where: { id: req.params.id },
        returning: true,
        plain: true,
      })
        .then(async (result) => {
          await transaction.commit();
          result ? res.json(result[1].dataValues) : res.sendStatus(404);
        });
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      res.status(400).json(app.helpers.prettifyValidationErrors(err));
    }

  }

  function deleteVideo(req, res) {
    return VideoModel.destroy({ where: { id: req.params.id } })
      .then((data) => (data ? res.json(data) : res.sendStatus(404)))
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
        } else {
          res.sendStatus(500);
        }
      });
  }

  async function startStreaming(req, res, next) {
    const videoId = req.params.id;

    const video = await VideoModel.findOne({ where: { id: videoId } });
    const s3 = app.helpers.getS3Instance();
    let params = {
      Bucket: process.env.NODE_S3_BUCKET_NAME,
      Key: `uploads/${video.filename}`,
    };

    s3.headObject(params, async function (err, data) {
      const range = req.headers.range;
      if (range !== null) {
        const bytes = range.replace(/bytes=/, "").split("-");
        const start = parseInt(bytes[0], 10);
        const total = data.ContentLength;
        const end = bytes[1] ? parseInt(bytes[1], 10) : total - 1;
        const chunksize = (end - start) + 1;
        const videoRange = `bytes ${start}-${end}/${total}`;

        res.writeHead(206, {
          "Content-Range": videoRange,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Last-Modified": data.LastModified,
          "Content-Type": data.ContentType,
        });
        params = { ...params, Range: range };
        s3.getObject(params).createReadStream().pipe(res);
      } else {
        res.writeHead(200,
          {
            "Content-Length": data.ContentLength,
            "Last-Modified": data.LastModified,
            "Content-Type": data.ContentType,
          });
        s3.getObject(params).createReadStream().pipe(res);
      }
    });
  }

  async function commentVideo(req, res, next) {
    const { id } = req.params;
    const { comment } = req.body;

    if (!id || !comment) {
      res.status(400).json({ error: "Invalid fields" });
    }
    try {
      const video = await VideoModel.findOne({
        where: {
          id: id,
          deleted: false,
        },
      });
      const commentInstance = await CommentModel.create({
        content: comment,
        deleted: false,
        owner_id: req.user.id,
        video_id: video.id,
      });
      await commentInstance.save();
      const commentAdded = await CommentModel.findOne({
        where: {
          id: commentInstance.id,
        },
        include: [{
          model: app.models.User,
          as: "user",
        }],
      });
      res.status(200).json({ "comment": commentAdded });
    } catch (err) {
      res.status(400).json(err);
    }
  }

  async function addVideoView(req, res, next) {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Invalid fields" });
    }
    try {
      const video = await VideoModel.findOne({
        where: {
          id: id,
          deleted: false,
        },
      });
      const viewModel = await ViewModel.create({
        owner_id: req.user ? req.user.id : null,
        video_id: video.id,
      });
      await viewModel.save();
      res.status(200).json({ "view": viewModel });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async function likeVideo(req, res, next) {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Invalid fields" });
    }
    try {
      const video = await VideoModel.findOne({
        where: {
          id: id,
          deleted: false,
        },
      });
      const exist = await LikeModel.findOne({
        where: {
          owner_id: req.user.id,
          video_id: video.id,
        },
      });

      if (!exist) {
        const likeAdded = await LikeModel.create({
          liked: true,
          deleted: false,
          owner_id: req.user.id,
          video_id: video.id,
        });
        await likeAdded.save();
        res.status(200).json({ "add_like": likeAdded });
      } else {
        const likeDeleted = await LikeModel.findOne({
          where: {
            owner_id: req.user.id,
            video_id: video.id,
          },
        });
        await likeDeleted.destroy();
        res.status(200).json({ "remove_like": likeDeleted });
      }

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async function followPlayer(req, res, next) {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Invalid fields" });
    }

    try {
      const video = await VideoModel.findOne({
        where: {
          id: id,
          deleted: false,
        },
        include: [
          {
            model: app.models.User,
            as: "user",
            include: [
              {
                model: app.models.Player,
                as: "player",
              }
            ]
          },
        ],
      });


      const currentUser = await UserModel.findOne({
        where: { id: req.user.id },
      });


      const exist = await currentUser.getFollow({ where: { id: video.user.id } });


      if (exist.length > 0) {
        await currentUser.removeFollow(video.user.player.id);
        res.status(200).json({ "remove_follow": video.user.id });
      } else {
        await currentUser.addFollow(video.user.player.id);
        res.status(200).json({ "add_follow": video.user.id });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
