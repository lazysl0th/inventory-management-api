import { mergeResolvers } from '@graphql-tools/merge';
import inventoryResolvers from './resolvers/inventory.js'
import itemResolvers from './resolvers/item.js'
import commentResolvers from './resolvers/comment.js';
import { select } from '../services/tag.js'
import { searchTags } from '../models/tag.js'
import userResolvers from './resolvers/user.js';

const commomResolvers = {
    Query: {
        tags: async (_, __, { prisma }) => await select(prisma),
        searchTags: async(_, { searchQuery }, { prisma }) => await searchTags(searchQuery, prisma)
    },
    Mutation: {

    },
};

const resolvers = mergeResolvers([
    inventoryResolvers,
    itemResolvers,
    commentResolvers,
    commomResolvers,
    userResolvers
]);

export default resolvers;