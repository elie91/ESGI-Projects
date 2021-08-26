const { forwardTo } = require('prisma-binding')

async function event (parent, args, ctx, info) {
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function events (parent, args, ctx, info) {
  return forwardTo('prisma')(parent, args, ctx, info)
}

module.exports = {
  event,
  events
}
