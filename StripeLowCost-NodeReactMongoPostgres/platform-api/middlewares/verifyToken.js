module.exports = (app, roles = []) => {
  const Merchant = app.sequelize.models.Merchant;
  return async (req, res, next) => {
    try {
      const authHeader = req.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");
        return await app.helpers.verifyToken(token)
          .catch(error => console.error(error) || res.status(400).json({message: "error during verify token"}))
          .then(async (payload) => {
            roles = roles instanceof Array ? roles : [ roles ];
            for (const role of roles) {
              if (payload.role === role) {
                req.user = payload;
                if(req.user.role === "MERCHANT") {
                  const merchant = await Merchant.findAll({where: {"UserId" : req.user.id}})
                  req.user.merchant_id = merchant[0].id
                }
                next();
                return;
              }
            }
            res.status(500).json({message: "role not allowed"});
          })
      }
      if (authHeader && authHeader.startsWith("Basic ")) {
        let token = authHeader.replace("Basic ", "");
        token = token.split(":");
        Merchant.findOne({
            where: {
              "public_key": token[0],
            },
          },
        ).then(data => {
          if (data.secret_key === token[1]) {
            req.merchant_id = data.id;
            req.currency = data.currency;
          }else{
            res.status(403).json({message: "Vos clés API ne correspondent pas"})
          }
          next();
        })
        .catch(() => res.status(404).json({message: "Vos clés API sont incorrectes ou expirées"}))
      }
    } catch(error) {
      app.logger.error({ error });
      res.error(error);
    }
  }
};
