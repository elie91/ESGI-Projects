const {me} = require("./auth");
const {user, users} = require("./Queries/queryUser");
const {home, homes} = require("./Queries/queryHome");
const {event, events} = require("./Queries/queryEvent");
const {service, services} = require("./Queries/queryService");
const {option, options} = require("./Queries/queryOption");
const {picture, pictures} = require("./Queries/queryPicture");
const {rent, rents} = require("./Queries/queryRent");
const {eventUsers} = require("./Queries/queryEventUser");

const Query = {
  me,
  user,
  users,
  home,
  homes,
  event,
  events,
  service,
  services,
  option,
  options,
  picture,
  pictures,
  rent,
  rents,
  eventUsers
};

module.exports = {
  Query,
};
