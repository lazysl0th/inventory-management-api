import { mergeResolvers } from '@graphql-tools/merge';
import inventoryResolvers from './resolvers/inventory.js'
import itemResolvers from './resolvers/item.js'
import commentResolvers from './resolvers/comment.js';
import { select } from '../services/tag.js'

const commomResolvers = {
    Query: {
        tags: async (_, __, { prisma }) => await select(prisma),
    },
    Mutation: {

    },
};


const resolvers = mergeResolvers([
    inventoryResolvers,
    itemResolvers,
    commentResolvers,
    commomResolvers
]);

export default resolvers;