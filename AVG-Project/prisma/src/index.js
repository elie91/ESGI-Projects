const {GraphQLServer} = require("graphql-yoga");
const {Prisma} = require("prisma-binding");
const resolvers = require("./resolvers");
require("dotenv").config();

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: req => ({
    req,
    prisma: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: process.env.URL_DB_PRISMA,
      debug: false,
    }),
  }),
});

const options = {
  bodyParserOptions: {limit: "300mb"},
};

server.start(options, () => console.log(`GraphQL server is running on ${process.env.URL_DB_PRISMA}`),
).catch(r => console.log(r));
