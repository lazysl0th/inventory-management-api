import { create, get, getItemComments } from '../../services/comment.js'

const commentResolvers = {
    Query: {
        comments: async (_, args, { prisma }) => await get(args, prisma),
    },
    Mutation: {
        createComment: async (_, { input }, { user }) => await create(input, user),
    },
    /*Comment: {
        user: async (parent, _,) => await selectUserComments(parent.userId),
        inventory: async (parent, _,) => await getInventoryComments(parent.inventoryId),
        item: async (parent, _,) => await getItemComments(parent.itemId)
    },*/
};

export default commentResolvers;