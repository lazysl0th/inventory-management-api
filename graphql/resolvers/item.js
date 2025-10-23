import { selectAllItems, selectItemById } from '../../models/item.js';
import { create, update, del, like } from '../../services/item.js'
import { getLikesCount, isLikedByUser } from '../../services/like.js';

const itemResolvers = {
    Query: {
        items: async (_, { inventoryId }, { prisma }) => selectAllItems(inventoryId, prisma),
        item: async (_, { id }) => selectItemById(id),
    },
    Mutation: {
        createItem: async (_, { input }, { user }) => create(input, user),
        deleteItem: async (_, { ids }) => del(ids),
        updateItem: async (_, { id, input }) => update(id, input),
        toggleLikeItem: async (_, { id }, { user }) => like(id, user),
    },
    Item: {
        likesCount: async (parent, _,) => await getLikesCount(parent.id),
        likedByMe: async (parent, _, { user }) => await isLikedByUser(user.id, parent.id),
    },
};

export default itemResolvers;