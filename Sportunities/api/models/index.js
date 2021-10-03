const { Sequelize, DataTypes } = require("sequelize");

module.exports = app => {

  app.sequelize = new Sequelize({
    database: process.env.POSTGRES_DB,
    dialect: "postgres",
    host: process.env.POSTGRES_HOST,
    logging: app.config.database.option.log,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    timezone: "+01:00",
    schema: "public",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  app.helpers.operators = {
    or: Sequelize.Op.or,
    and: Sequelize.Op.and,
    notLike: Sequelize.Op.notLike,
    like: Sequelize.Op.like,
    ne: Sequelize.Op.ne,
    not: Sequelize.Op.not,
    gte: Sequelize.Op.gte,
    eq: Sequelize.Op.eq,
    gt: Sequelize.Op.gt,
    lt: Sequelize.Op.lt,
    lte: Sequelize.Op.lte,
    between: Sequelize.Op.between,
    in: Sequelize.Op.in,
    notIn: Sequelize.Op.notIn,
  };

  // Fixture models
  const Fixtures = app.sequelize.define("Fixtures", {
    version: {
      type: DataTypes.STRING(45),
    },
  }, {
    ...app.config.database.models,
  });

  // Add models
  app.models = {
    Agent: require("./Agent")(app, Sequelize),
    Club: require("./Club")(app, Sequelize),
    Comment: require("./Comment")(app, Sequelize),
    Conversation: require("./Conversation")(app, Sequelize),
    Document: require("./Document")(app, Sequelize),
    Experience: require("./Experience")(app, Sequelize),
    Like: require("./Like")(app, Sequelize),
    Message: require("./Message")(app, Sequelize),
    Player: require("./Player")(app, Sequelize),
    Sport: require("./Sport")(app, Sequelize),
    Position: require("./Position")(app, Sequelize),
    Tag: require("./Tag")(app, Sequelize),
    User: require("./User")(app, Sequelize),
    Video: require("./Video")(app, Sequelize),
    View: require("./View")(app, Sequelize),
    Fixtures,
  };
  app.associations = {
    core (app) {
      let relations = {};
      const {
        Agent,
        Club,
        Comment,
        Conversation,
        Document,
        Experience,
        Like,
        Message,
        Player,
        Sport,
        Tag,
        User,
        Video,
        View,
      } = app.models;
      let models = app.models;
      // Link User & VideoItem
      relations.userVideos = app.models.User.hasMany(app.models.Video, { as: "videos", foreignKey: "owner_id" });
      relations.videoUsers = app.models.Video.belongsTo(app.models.User, { as: "user", foreignKey: "owner_id" });

      // Link User & Comment
      relations.userComments = app.models.User.hasMany(app.models.Comment, {
        as: "comments",
        foreignKey: "owner_id",
      });
      relations.commentUsers = app.models.Comment.belongsTo(app.models.User, {
        as: "user",
        foreignKey: "owner_id",
      });

      // Link User & Like
      relations.userLikes = app.models.User.hasMany(app.models.Like, { as: "likes", foreignKey: "owner_id" });
      relations.likeUsers = app.models.Like.belongsTo(app.models.User, { as: "user", foreignKey: "owner_id" });

      // Link User & View
      relations.userViews = app.models.User.hasMany(app.models.View, { as: "views", foreignKey: "owner_id" });
      relations.viewUsers = app.models.View.belongsTo(app.models.User, { as: "user", foreignKey: "owner_id" });

      // Link User & Document
      relations.userDocuments = app.models.User.hasMany(app.models.Document, {
        as: "documents",
        foreignKey: "owner_id",
      });
      relations.documentUsers = app.models.Document.belongsTo(app.models.User, {
        as: "user",
        foreignKey: "owner_id",
      });

      // Link User & Player
      // User is a Player
      relations.userPlayer = app.models.User.hasOne(app.models.Player, {
        as: "player",
        foreignKey: "owner_id",
        primaryKey: true
      });
      relations.playerUsers = app.models.Player.belongsTo(app.models.User, {
        as: "user",
        foreignKey: "owner_id",
        primaryKey: true,
      });

      // User follow a Player
      relations.userFollowPlayers = app.models.User.belongsToMany(app.models.Player, {
        through: "Follow",
        foreignKey: "user_id",
        as: "follow",
      });

      relations.playerFollowedByUsers = app.models.Player.belongsToMany(app.models.User, {
        through: "Follow",
        foreignKey: "player_id",
        as: "followedBy",
      });

      // Link User & Agent
      relations.userAgent = app.models.User.hasOne(app.models.Agent, { as: "agent", foreignKey: "owner_id" });
      relations.agentUsers = app.models.Agent.belongsTo(app.models.User, { as: "user", foreignKey: "owner_id" });

      // Link User & Conversation

      // Link Sender & Conversation
      relations.userConversations = app.models.User.hasMany(app.models.Conversation, {
        as: "sentConversation",
        foreignKey: {
          name: "sender_id",
          primaryKey: true,
        },
      });

      relations.conversationUsers = app.models.Conversation.belongsTo(app.models.User, {
        as: "userSender",
        foreignKey: {
          name: "sender_id",
          primaryKey: true,
        },
      });

      // Link Receiver & Conversation
      relations.userReceiverConversations = app.models.User.hasMany(app.models.Conversation, {
        as: "receivedConversation",
        foreignKey: {
          name: "receiver_id",
          primaryKey: true,
        },
      });

      relations.conversationReceiverUsers = app.models.Conversation.belongsTo(app.models.User, {
        as: "userReceiver",
        foreignKey: {
          name: "receiver_id",
          primaryKey: true,
        },
      });

      // Link Conversation & Message
      relations.conversationMessages = app.models.Conversation.hasMany(app.models.Message, {
        as: "messages",
        foreignKey: "conversation_id",
      });
      relations.messageConversations = app.models.Message.belongsTo(app.models.Conversation, {
        as: "conversation",
        foreignKey: "conversation_id",
      });

      // Link Player & Club
      relations.clubPlayers = app.models.Club.hasMany(app.models.Player, {
        as: "players",
        foreignKey: "club_id",
      });
      relations.playerClubs = app.models.Player.belongsTo(app.models.Club, {
        as: "club",
        foreignKey: "club_id",
      });

      // Link Agent & Club
      relations.clubAgents = app.models.Club.hasMany(app.models.Agent, { as: "agents", foreignKey: "club_id" });
      relations.agentClubs = app.models.Agent.belongsTo(app.models.Club, { as: "club", foreignKey: "club_id" });

      // Link Player & Experience
      relations.playerExperiences = app.models.Player.hasMany(app.models.Experience, {
        as: "experiences",
        foreignKey: "player_id",
      });
      relations.experiencePlayers = app.models.Experience.belongsTo(app.models.Player, {
        as: "player",
        foreignKey: "player_id",
      });

      // Link Player & Sport
      relations.sportPlayers = app.models.Sport.hasMany(app.models.Player, {
        as: "players",
        foreignKey: "sport_id",
      });
      relations.playerSports = app.models.Player.belongsTo(app.models.Sport, {
        as: "sport",
        foreignKey: "sport_id",
      });

      // Link Player & Position
      relations.positionPlayers = app.models.Position.hasMany(app.models.Player, {
        as: "player",
        foreignKey: "position_id",
      });

      relations.playerPositions = app.models.Player.belongsTo(app.models.Position, {
        as: "position",
        foreignKey: "position_id",
      });

      // Link Sport & Position

      relations.sportPositions = app.models.Sport.hasMany(app.models.Position, {
        as: "position",
        foreignKey: "sport_id",
      });

      relations.positionSports = app.models.Position.belongsTo(app.models.Sport, {
        as: "sport",
        foreignKey: "sport_id",
      });

      // Link Experience & Club
      relations.clubExperiences = app.models.Club.hasMany(app.models.Experience, {
        as: "experiences",
        foreignKey: "club_id",
      });
      relations.experienceClubs = app.models.Experience.belongsTo(app.models.Club, {
        as: "club",
        foreignKey: "club_id",
      });

      // Link Experience & Position
      relations.positionExperiences = app.models.Position.hasMany(app.models.Experience, {
        as: "positions",
        foreignKey: "position_id",
      });
      relations.experiencePositions = app.models.Experience.belongsTo(app.models.Position, {
        as: "position",
        foreignKey: "position_id",
      });


      // Link VideoItem & Tag
      relations.videoTags = app.models.Video.belongsToMany(app.models.Tag, {
        through: "VideoTag",
        foreignKey: "video_id",
        as: "tags",
      });
      relations.tagVideos = app.models.Tag.belongsToMany(app.models.Video, {
        through: "VideoTag",
        foreignKey: "tag_id",
        as: "videos",
      });

      // Link VideoItem & Sport
      relations.videoSports = app.models.Video.belongsTo(app.models.Sport, {
        as: "sport",
        foreignKey: "sport_id",
      });
      relations.sportVideos = app.models.Sport.hasMany(app.models.Video, {
        as: "videos",
        foreignKey: "sport_id",
      });

      // Link VideoItem & Comment
      relations.videoComments = app.models.Video.hasMany(app.models.Comment, {
        as: "comments",
        foreignKey: "video_id",
      });
      relations.commentVideos = app.models.Comment.belongsTo(app.models.Video, {
        as: "video",
        foreignKey: "video_id",
      });

      // Link video & Like
      relations.videoLikes = app.models.Video.hasMany(app.models.Like, { as: "likes", foreignKey: "video_id" });
      relations.likeVideos = app.models.Like.belongsTo(app.models.Video, {
        as: "video",
        foreignKey: "video_id",
      });

      // Link VideoItem & View
      relations.videoViews = app.models.Video.hasMany(app.models.View, { as: "views", foreignKey: "video_id" });
      relations.viewVideos = app.models.View.belongsTo(app.models.Video, {
        as: "video",
        foreignKey: "video_id",
      });

      app.relations = relations;
    },
  };
  app.openConnection = app.sequelize
    .authenticate()
    .then(() => {
      app.logger.info("[model] Connection has been established successfully!");
    })
    .catch((err) => {
      app.logger.error("[model] Unable to connect to the database:", err);
    });

};
