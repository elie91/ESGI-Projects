const fs = require('fs');
require("dotenv").config();
const jwt = require("jsonwebtoken");

async function getUser(ctx) {
  const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_FILE);
  const Authorization = ctx.req.request.get("authorization");
  if (Authorization && Authorization !== "null") {
    const token = Authorization.replace('Bearer ', '');
    const user = jwt.verify(token, publicKey, {algorithm: 'RS256'});
    if (!user) {
      throw new AuthError();
    }
    return await ctx.prisma.query.user({where: {id: user.id}}, "{ id firstname lastname email roles }");
  } else {
    throw new AuthError();
  }
}

function checkUserRole(user, role) {
  if (!user.roles.includes(role) && !user.roles.includes("ROLE_ADMIN")) {
    throw new AuthError();
  }
}

class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}

module.exports = {
  getUser,
  checkUserRole
};
