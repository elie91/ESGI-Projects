const {forwardTo} = require('prisma-binding')
const {getUser} = require('../../utils');

async function createService(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function updateService(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function deleteService(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}


module.exports = {
  createService,
  updateService,
  deleteService
}
