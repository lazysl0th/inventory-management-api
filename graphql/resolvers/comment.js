import { PubSub } from "graphql-subscriptions";
export const pubsub = new PubSub();

import { create, get, getItemComments } from '../../services/comment.js'

const commentResolvers = {
    Query: {
        comments: async (_, { inventoryId }, { prisma }) => await get(inventoryId, prisma),
    },
    Mutation: {
        createComment: async (_, { input }, { user, prisma }) => {
            const comment = await create(input, user, prisma);
            await pubsub.publish(`COMMENT_ADDED_${input.inventoryId}`, { commentAdded: comment })
            return comment;
        }
    },
    /*Comment: {
        user: async (parent, _,) => await selectUserComments(parent.userId),
        inventory: async (parent, _,) => await getInventoryComments(parent.inventoryId),
        item: async (parent, _,) => await getItemComments(parent.itemId)
    },*/
    Subscription: {
        commentAdded: { subscribe: (_, { inventoryId }) => pubsub.asyncIterableIterator(`COMMENT_ADDED_${inventoryId}`), },
    },
};

export default commentResolvers;