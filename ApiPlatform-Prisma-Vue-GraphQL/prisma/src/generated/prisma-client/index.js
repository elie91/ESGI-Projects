"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "DoctrineMigrationVersion",
    embedded: false
  },
  {
    name: "Event",
    embedded: false
  },
  {
    name: "Home",
    embedded: false
  },
  {
    name: "Option",
    embedded: false
  },
  {
    name: "Picture",
    embedded: false
  },
  {
    name: "Rent",
    embedded: false
  },
  {
    name: "Service",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "EventUser",
    embedded: false
  },
  {
    name: "ServiceRent",
    embedded: false
  },
  {
    name: "OptionHome",
    embedded: false
  },
  {
    name: "Notification",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `${process.env["URL_DB_PRISMA"]}`
});
exports.prisma = new exports.Prisma();
