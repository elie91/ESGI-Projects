module.exports = (SchemaName, faker, models, logger) => Promise.all([
  // Create a merchant user
  models.User.create({
    firstname: "Elie",
    lastname: "Bismuth",
    email: "eliebismuth@mail.com",
    phone: "0769826892",
    password: "password",
    role: "MERCHANT",
  }, {customOptions :{isFixture: true}}).then((user) => {
    logger.info(`[platform-api][faker][${SchemaName}] User merchant created ` + user.email);
  })
    .catch((err) => {
      logger.error(`[platform-api][faker][${SchemaName}] Couldn't create Merchant user `, err);
    }),

    models.User.create({
        firstname: "Thomas",
        lastname: "Coichot",
        email: "tcoichot@mail.com",
        phone: "0769826892",
        password: "password",
        role: "MERCHANT",
    }, {customOptions :{isFixture: true}}).then((user) => {
        logger.info(`[platform-api][faker][${SchemaName}] User merchant created ` + user.email);
    })
        .catch((err) => {
            logger.error(`[platform-api][faker][${SchemaName}] Couldn't create Merchant user `, err);
        }),

  // Create an admin user
  models.User.create({
    firstname: "admin",
    lastname: "admin",
    email: "admin@gmail.com",
    phone: "0769821524",
    password: "password",
    role: "ADMIN",
  }, {customOptions :{isFixture: true}})
    .then(logger.info(`[platform-api][faker][${SchemaName}] User Admin  created`))
    .catch((err) => {
      logger.error(`[platform-api][faker][${SchemaName}] Couldn't create User Admin  `, err);
    }),

  // Create users
  // generateMultipleUsers(SchemaName, faker, models, logger),

]);

function generateMultipleUsers (SchemaName, faker, models, logger) {

  let promiseArray = [];
  let userNumber = 10;

  for (var i = 0; i < userNumber; i++) {
    const fullName = faker.name.findName().split(" ");

    promiseArray.push(models.User.create({
        firstname: fullName[0],
        lastname: fullName[1],
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber("07########"),
        password: "user",
        role: "MERCHANT",
      }).catch((err) => {
        logger.error(`[platform-api][faker][${SchemaName}] Couldn't create multiple users `, err);
      }),
    );

  }

  return promiseArray;

}
