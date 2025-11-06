import { selectAllItems, selectItemById } from '../../models/item.js';
import { create, update, del, like } from '../../services/item.js'
import { getLikesCount, isLikedByUser } from '../../services/like.js';

const itemResolvers = {
    Query: {
        items: async (_, { inventoryId }, { prisma }) => selectAllItems(inventoryId, prisma),
        item: async (_, { id }, { prisma }) => selectItemById(id, prisma),
    },
    Mutation: {
        createItem: async (_, { input }, { user, prisma }) => create(input, user, prisma),
        deleteItems: async (_, { ids }, { prisma }) => del(ids, prisma),
        updateItem: async (_, { id, input, expectedVersion }, { prisma }) => update(id, input, expectedVersion, prisma),
        toggleLikeItem: async (_, { id }, { user }) => like(id, user),
    },
    Item: {
        likesCount: async (parent, _, { prisma }) => await getLikesCount(parent.id, prisma),
        likedByMe: async (parent, _, { user, prisma }) => await isLikedByUser(user.id, parent.id, prisma),
    },
};

export default itemResolvers;