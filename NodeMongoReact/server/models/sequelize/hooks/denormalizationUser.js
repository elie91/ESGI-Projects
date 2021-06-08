const UserMongo = require("../../User");
const Article = require("../Article");
const Movie = require("../Movie");

const denormalize = async (ModelPG, userID, operation) => {
  // Delete in mongo
  //plus rapide de delete et insert que update
  await UserMongo.deleteOne({ id: userID });

  if (operation !== "delete") {
    // Get User with association in DB if not delete
    const dUser = await ModelPG.findOne({
      where: { id: userID },
      include: [
        Article,
        { model: Movie, as: "DirectedMovies" },
        { model: Movie, as: "PlayedMovies" },
      ],
    });

    // Save in mongo
    const mUser = new UserMongo(dUser.toJSON());
    await mUser.save();
  }
};

module.exports = denormalize;
