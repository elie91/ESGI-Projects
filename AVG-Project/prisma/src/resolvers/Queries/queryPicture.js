const { forwardTo } = require('prisma-binding')

async function picture(parent, args, ctx, info) {
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function pictures(parent, args, ctx, info) {
  return forwardTo('prisma')(parent, args, ctx, info)
}

module.exports = {
  picture,
  pictures
}
