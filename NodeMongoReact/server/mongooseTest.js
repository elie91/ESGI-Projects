const connection = require("./lib/db");

const SakilaFilm = require("./models/SakilaFilm");

// Find
//SakilaFilm.find({
//  Category: /horror/i
//}, {Length: 1}).sort({
//  Description: 1
//}).limit(5).then(data => console.log(data));

// Insert
//const film = new SakilaFilm({
//  Title: "Mon film",
//  Category: "Action"
//});
//film.save().then(data => console.log('insert', data));

// Delete par repository
//SakilaFilm.deleteMany({
//  Title: "Mon film"
//}).then(data => console.log("delete", data));

// Delete par entité
//const film2 = new SakilaFilm({
//  Title: "Mon film",
//  Category: "Action"
//});
//
//film2.save().then(data => {
//  console.log('insert2', data)
//  film2.remove().then(data => console.log('delete2', data));
//});

// Update
//const movie = new SakilaFilm({
//  Title: "TestMongoose",
//  Length: 15
//});
//movie.save().then(result => {
//    console.log("create", result);
//    SakilaFilm.findById(result._id).then(doc => {
//      console.log("findById", result);
//      doc.Title = doc.Title + "V2";
//      doc.save().then(docUpdated => console.log("updated document", docUpdated));
//    });
//  }
//);

SakilaFilm.aggregate([
  { $project: { Category: 1 } },
  { $match: { Category: "Horror" } },
  { $group: { _id: "$Rating", total: { $sum: 1 } } },
  { $match: { total: { $gt: 10 } } },
  { $sort: { total: 1, _id: 1 } },
]).then((data) => console.log(data));

SakilaFilm.mapReduce({
  query: { Category: "Horror" },
  map: function () {
    emit(this.Rating, 1);
  },
  reduce: function (k, values) {
    return Array.sum(values);
  },
  sort: { value: 1, _id: 1 },
}).then((data) => console.log(data));
