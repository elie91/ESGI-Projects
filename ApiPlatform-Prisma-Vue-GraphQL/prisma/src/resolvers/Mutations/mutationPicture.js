const {forwardTo} = require('prisma-binding')
const {getUser} = require('../../utils');

async function createPicture(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function updatePicture(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function deletePicture(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}


module.exports = {
  createPicture,
  updatePicture,
  deletePicture
}
