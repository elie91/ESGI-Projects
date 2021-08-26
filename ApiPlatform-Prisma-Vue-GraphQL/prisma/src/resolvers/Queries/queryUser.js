const {forwardTo} = require('prisma-binding')
const {getUser, checkUserRole} = require('../../utils')

async function user(parent, args, ctx, info) {
  const user = await getUser(ctx);
  checkUserRole(user, 'ROLE_ADMIN')
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function users(parent, args, ctx, info) {
  const user = await getUser(ctx);
  checkUserRole(user, 'ROLE_ADMIN')
  return forwardTo('prisma')(parent, args, ctx, info)
}

module.exports = {
  user,
  users
}
