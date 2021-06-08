const { forwardTo } = require('prisma-binding')

async function option(parent, args, ctx, info) {
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function options(parent, args, ctx, info) {
  return forwardTo('prisma')(parent, args, ctx, info)
}

module.exports = {
  option,
  options
}
