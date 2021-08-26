const {forwardTo} = require('prisma-binding')
const {getUser} = require('../../utils');

async function createOption(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function updateOption(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function deleteOption(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}


module.exports = {
  createOption,
  updateOption,
  deleteOption
}
