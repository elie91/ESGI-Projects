const { forwardTo } = require('prisma-binding')

async function service(parent, args, ctx, info) {
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function services(parent, args, ctx, info) {
  return forwardTo('prisma')(parent, args, ctx, info)
}

module.exports = {
  service,
  services
}
