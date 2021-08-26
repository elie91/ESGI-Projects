const fs = require('fs');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {getUser} = require("../utils");

async function signup(_, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.mutation.createUser(
    {
      data: {
        email: args.email,
        lastname: args.lastname,
        firstname: args.firstname,
        password: password,
        phone: args.phone,
        roles: args.roles
      },
    },
  );
  const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_FILE);
  return {
    token: jwt.sign({userId: user.id}, privateKey, {algorithm: 'RS256'}),
    user,
  };
}

async function check_login(parent, {email, password}, ctx, info) {
  const user = await ctx.prisma.query.user({where: {email}}, "{ id lastname firstname email password roles }");
  if (!user) {
    throw new Error(`security.errors.credentials`);
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("security.errors.credentials");
  }

  const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_FILE);
  const privateSecret = {
    key: privateKey,
    passphrase: process.env.PRIVATE_KEY_PASSPHRASE
  }

  return {
    token: jwt.sign({
      id: user.id,
      lastname: user.lastname,
      firstname: user.firstname,
      roles: user.roles,
      username: user.email,
      email: user.email
    }, privateSecret, {algorithm: 'RS256', expiresIn: '50d'}),
    user,
  };
}

// Q currently user
async function me(parent, args, ctx, info) {
  return await getUser(ctx);
}

module.exports = {
  me,
  signup,
  check_login,
};
