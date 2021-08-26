module.exports = (SchemaName, faker, models, logger) => new Promise((resolve, reject) => {
  logger.info(`[platform-api][faker][${SchemaName}] Loading ${SchemaName} fixtures ...`);

  const fs = require('fs');
  const kbisBase64 = fs.readFileSync(__dirname + '/files/kbis.jpg', {encoding: 'base64'});

  models.User.findAll({
    where: {
      email: "eliebismuth@mail.com"
    }
  }).then((user) => {
      // Create a merchant
      // logger.info("userId");
      // logger.info(user);

      models.Merchant.create({
        UserId: user[0].id,
        name: "Yves&Co",
        public_key: "publicKey",
        secret_key: "secretKey",
        kbis: kbisBase64,
        address: "20 rue Jean Moulin 75001",
        postal_code: "75001",
        city: "Paris",
        phone: "0158689473",
        confirmation_url: "http://localhost:3000",
        cancellation_url: "http://localhost:3000",
        approved: false,
        currency: "eur",
      })
        .then((merchant) => {
            logger.info(`[platform-api][faker][${SchemaName}] Merchant created`);
            resolve();
          }
        ).catch((err) => {
        logger.error(`[platform-api][faker][${SchemaName}] Couldn't create default merchant `, err);
      })
      ;

    }, (err) => {
      logger.error(`[platform-api][faker][${SchemaName}] Couldn't get user `, err);
    }
  );

    models.User.findAll({
        where: {
            email: "tcoichot@mail.com"
        }
    }).then((user) => {
            models.Merchant.create({
                UserId: user[0].id,
                name: "Google&Co",
                public_key: "publicKey",
                secret_key: "secretKey",
                kbis: kbisBase64,
                address: "20 rue Jean Moulin 75001",
                postal_code: "75001",
                city: "Paris",
                phone: "0158689473",
                confirmation_url: "http://localhost:3000",
                cancellation_url: "http://localhost:3000",
                approved: false,
                currency: "eur",
            })
                .then((merchant) => {
                        logger.info(`[platform-api][faker][${SchemaName}] Merchant created`);
                        resolve();
                    }
                ).catch((err) => {
                logger.error(`[platform-api][faker][${SchemaName}] Couldn't create default merchant `, err);
            })
            ;

        }, (err) => {
            logger.error(`[platform-api][faker][${SchemaName}] Couldn't get user `, err);
        }
    );
});