const {forwardTo} = require('prisma-binding')
const {getUser} = require('../../utils');

async function createEventUser(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}


module.exports = {
  createEventUser
}
