const {forwardTo} = require('prisma-binding')

async function createRent(parent, args, ctx, info) {
  return forwardTo('prisma')(parent, args, ctx, info)
}

module.exports = {
  createRent
}
