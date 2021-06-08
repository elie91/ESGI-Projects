const {forwardTo} = require('prisma-binding')


async function rents(parent, args, ctx, info) {
    return forwardTo('prisma')(parent, args, ctx, info)
}

async function rent(parent, args, ctx, info) {
  return forwardTo('prisma')(parent, args, ctx, info)
}


module.exports = {
  rents,
  rent,
}
