const { QueryTypes } = require("sequelize");
module.exports = (app) => {

  const PlayerModel = app.sequelize.models.Player;
  const UserModel = app.sequelize.models.User;

  return {
    createPlayer,
    getFamousPlayer,
    getPlayers,
    getPlayer,
    updatePlayer,
  };

  function createPlayer (req, res, next) {

    let newItem = {
      height: req.body.height,
      weight: req.body.weight,
      nationality: req.body.nationality,
      position_id: req.body.position_id,
      sport_id: req.body.sport_id,
      owner_id: req.user.id,
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
      if (req.body.club_id) {
        newItem = {
          ...newItem,
          club_id: req.body.club_id,
        };
      }

    }

    return PlayerModel.create(newItem, {
      include: (req.body.club || req.body.club_id) ? [
        {
          association: app.relations.playerClubs,
          as: "club",
        },
      ] : [],
    }).then((player) => {
      return UserModel.update({
        role: ["ROLE_PLAYER"],
        hasChosenRole: true,
      }, {
        where: { id: req.user.id },
        returning: true,
        plain: true,
      }).then((result) => {
        if (result) {
          let values = {
            ...result[1].dataValues,
            role: ["ROLE_PLAYER"],
            player: player.dataValues,
          };

          delete values.image;

          app.helpers.createToken(values)
            .then((token) => {
              res.json({
                user: values,
                token,
              });
            }).catch((e) => console.log("Token", e) || res.sendStatus(500));
        } else {
          res.sendStatus(404);
        }
      }).catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).json(app.helpers.prettifyValidationErrors(err.errors));
        } else {
          res.sendStatus(500);
        }
      });
    }).catch((error) => {
      res.status(400).json(app.helpers.prettifyValidationErrors(error));
    });
  }

  function getFamousPlayer (req, res, next) {
    const { page, limit } = req.query;
    return PlayerModel.findAndCountAll({
      attributes: {
        include: [
          [
            app.sequelize.literal(`(
            SELECT COUNT(*) 
            FROM public."Like" AS cl 
            INNER JOIN public."Video" as vd 
            ON vd.id = cl.video_id WHERE cl.deleted = false AND "user".id = vd.owner_id)`), "likes",
          ],
          [
            app.sequelize.literal(`(
            SELECT COUNT(*)
            FROM public."View" AS cv
            INNER JOIN public."Video" as vd
            ON vd.id = cv.video_id WHERE cv.deleted = false AND "user".id = vd.owner_id)`), "views",
          ],
        ],
      },
      where: {
        ...app.helpers.orConditionFormatParams(req.query),
        ...app.helpers.ownerParam(req.query),
      },
      distinct: true,
      order: [
        [app.sequelize.literal(`"likes" DESC`)],
        [app.sequelize.literal(`"views" DESC`)],
        ["createdAt", "DESC"],
      ],
      include: [
        {
          model: app.models.User,
          as: "user",
        },
      ],
      ...app.helpers.getLimitAndOffset(page, limit),
    })
      .then(async (players) => {
        res.json(players);
      })
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function getPlayers (req, res, next) {
    if (req.user) {

      let params = {
        ...req.query,
      };

      if (params.user) {
        delete params.user;
      }

      let whereQuery = ``;
      let limitQuery = ``;
      let replacement = {
        sender: req.user.id,
        ...app.helpers.getLimitAndOffset(req.query.page, req.query.limit),
      };

      if (req.query.user) {
        whereQuery += ` AND u.lastname ILIKE :lastname OR u.firstname ILIKE :firstname `;
        replacement = {
          ...replacement,
          lastname: req.query.user.lastname + "%",
          firstname: req.query.user.firstname + "%",
        };
      }

      if (req.query.club) {
        whereQuery += ` AND c.id = :club `;
        replacement = {
          ...replacement,
          club: req.query.club,
        };
      }

      if (req.query.height) {
        whereQuery += ` AND p.height >= :minHeight AND p.height <= :maxHeight `;
        replacement = {
          ...replacement,
          minHeight: req.query.height.min,
          maxHeight: req.query.height.max,
        };
      }

      if (req.query.birthday) {
        whereQuery += ` AND u.birthday <= :minBirthday AND u.birthday >= :maxBirthday `;
        replacement = {
          ...replacement,
          minBirthday: req.query.birthday.min,
          maxBirthday: req.query.birthday.max,
        };
      }

      if (req.query.sport) {
        whereQuery += ` AND p.sport_id = :sport `;
        replacement = {
          ...replacement,
          sport: req.query.sport,
        };
      }

      if (req.query.position) {
        whereQuery += ` AND p.position_id = :position `;
        replacement = {
          ...replacement,
          position: req.query.position,
        };
      }

      if (req.query.page) {
        limitQuery += " LIMIT :limit OFFSET :offset ";
      }

      app.sequelize.query(
        `SELECT p.id,
                CASE WHEN C2.id IS NULL THEN false ELSE true END as hasConversation,
                jsonb_agg(jsonb_build_object(
                        'id', u.id,
                        'lastname', u.lastname,
                        'firstname', u.firstname,
                        'email', u.email,
                        'birthday', u.birthday,
                        'phone', u.phone,
                        'role', u.role,
                        'image', u.image,
                        'deleted', u.deleted,
                        'createdAt', u."createdAt",
                        'updatedAt', u."updatedAt"
                    ))                                           AS "user",
                jsonb_agg(jsonb_build_object(
                        'id', p.id,
                        'banner', p.banner,
                        'height', p.height,
                        'weight', p.weight,
                        'nationality', p.nationality,
                        'deleted', p.deleted,
                        'createdAt', p."createdAt",
                        'updatedAt', p."updatedAt"
                    ))                                           AS "player",
                CASE
                    WHEN po.id IS NOT NULL THEN jsonb_agg(jsonb_build_object(
                            'id', po.id,
                            'value', po.value,
                            'createdAt', po."createdAt",
                            'updatedAt', po."updatedAt"
                        )) END                                   AS "position",
                CASE
                    WHEN c.id IS NOT NULL THEN jsonb_agg(jsonb_build_object(
                            'id', c.id,
                            'name', c.name,
                            'logo', c.logo,
                            'city', c.city,
                            'postalCode', c."postalCode",
                            'country', c.country,
                            'createdAt', c."createdAt",
                            'updatedAt', c."updatedAt"
                        )) END                                   AS "club"
         FROM public."Player" p
                  INNER JOIN public."User" u ON p.owner_id = u.id
                  LEFT JOIN "Club" c ON c.id = p.club_id
                  LEFT JOIN "Position" po ON po.id = p.position_id
                  LEFT JOIN "Conversation" C2 ON u.id = C2.receiver_id AND C2.sender_id = :sender
         WHERE u.deleted != true ${whereQuery} ${limitQuery}
         GROUP BY p.id, C2.id, po.id, c.id`,
        {
          replacements: replacement,
          type: QueryTypes.SELECT,
        },
      ).then(result => {
        if (result) {
          res.json(result.map(item => {
            return {
              ...item.player[0],
              user: item.user[0],
              club: item.club ? item.club[0] : null,
              position: item.position ? item.position[0] : null,
              hasConversation: item.hasconversation,
            };
          }));
        } else {
          res.statusCode(500);
        }
      }).catch((err) => console.log(err) || res.sendStatus(500));
    } else {
      return PlayerModel.findAll({
        where: {
          ...app.helpers.orConditionFormatParams(req.query),
          deleted: false,
        },
        include: [
          {
            model: app.models.User,
            as: "user",
          },
          {
            model: app.models.Club,
            as: "club",
          },
          {
            model: app.models.Position,
            as: "position",
          },
        ],

      }).then((data) => res.json(data))
        .catch((err) => console.log(err) || res.sendStatus(500));
    }

  }

  function getPlayer (req, res, next) {
    return PlayerModel.findOne({
      where: {
        id: req.params.id,
        deleted: false,
      },
      include: [
        {
          model: app.models.User,
          as: "user",
          include: [
            {
              association: app.relations.userReceiverConversations,
              as: "receivedConversation",
            },
          ],
        },
        {
          model: app.models.Club,
          as: "club",
        },
        {
          model: app.models.Position,
          as: "position",
        },
        {
          model: app.models.Sport,
          as: "sport",
        },
        {
          model: app.models.Experience,
          as: "experiences",
          include: [
            {
              model: app.models.Position,
              as: "position",
            },
            {
              model: app.models.Club,
              as: "club",
            },
          ],
        },
      ],
    }).then((data) => data ? res.json(data) : res.sendStatus(404))
      .catch((err) => console.log(err) || res.sendStatus(500));
  }

  function updatePlayer (req, res) {

    let object = {
      ...req.body,
      height: req.body.height,
      weight: req.body.weight,
      nationality: req.body.nationality,
    };

    if (req.body.sport) {
      object = {
        ...object,
        sport_id: req.body.sport_id,
      };
    }

    if (req.body.position) {
      object = {
        ...object,
        position_id: req.body.position_id,
      };
    }

    return PlayerModel.update(object, {
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

};
