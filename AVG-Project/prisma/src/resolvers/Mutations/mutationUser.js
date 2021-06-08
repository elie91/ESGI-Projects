const {forwardTo} = require('prisma-binding')
const {getUser, checkUserRole} = require('../../utils');

async function createUser(parent, args, ctx, info) {
  const user = await getUser(ctx);
  checkUserRole(user, 'ROLE_ADMIN')
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function updateUser(parent, args, ctx, info) {
  const user = await getUser(ctx);
  checkUserRole(user, 'ROLE_ADMIN')
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function deleteUser(parent, args, ctx, info) {
  const user = await getUser(ctx);
  checkUserRole(user, 'ROLE_ADMIN')
  return forwardTo('prisma')(parent, args, ctx, info)
}


module.exports = {
  createUser,
  updateUser,
  deleteUser
}
