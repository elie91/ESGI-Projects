const {forwardTo} = require('prisma-binding')
const {getUser} = require('../../utils');

async function createEvent(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function updateEvent(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function deleteEvent(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}


module.exports = {
  createEvent,
  updateEvent,
  deleteEvent
}
