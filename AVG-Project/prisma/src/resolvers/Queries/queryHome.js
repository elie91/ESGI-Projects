const {forwardTo} = require('prisma-binding')
const {getUser} = require('../../utils')

async function home(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function homes(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)

}

module.exports = {
  home,
  homes
}
