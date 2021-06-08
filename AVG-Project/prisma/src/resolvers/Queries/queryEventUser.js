const { forwardTo } = require('prisma-binding')

async function eventUsers (parent, args, ctx, info) {
  return forwardTo('prisma')(parent, args, ctx, info)
}

module.exports = {
  eventUsers
}
