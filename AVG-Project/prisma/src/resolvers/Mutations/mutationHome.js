const {forwardTo} = require('prisma-binding')
const {getUser} = require('../../utils');

async function createHome(parent, args, ctx, info) {
  const user = await getUser(ctx);
  return await ctx.prisma.mutation.createHome({
    data: {
      ...args.data,
      owner: {connect: {id: user.id}}
    }
  });
}

async function updateHome(parent, args, ctx, info) {
  await getUser(ctx);
  if (args.homeOption) {
    const homeCurrentOptions = await ctx.prisma.query.options({
      where: {
        homeOption: {
          id: args.where.id
        }
      }
    });
    await ctx.prisma.mutation.updateHome({
      data: {
        homeOption: {
          disconnect: homeCurrentOptions.map(option => {
            return {
              id: option.id
            }
          })
        }
      },
      where: {id: args.where.id}
    })
  }
  return forwardTo('prisma')(parent, args, ctx, info)
}

async function deleteHome(parent, args, ctx, info) {
  await getUser(ctx);
  return forwardTo('prisma')(parent, args, ctx, info)
}


module.exports = {
  createHome,
  updateHome,
  deleteHome
}
