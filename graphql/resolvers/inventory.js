import { selectInventoryById, addAllowUsers, deleteAllowUsers, searchInventory } from '../../models/inventory.js';
import { create, del, update, selectInventories } from '../../services/inventory.js';

const inventoryResolvers = {
    Query: {
        selectInventories: async (_, args, { prisma }) => await selectInventories(args, prisma),
        selectInventory: async (_, { id }, { prisma }) => await selectInventoryById(id, prisma),
        searchInventories: async (_, { searchQuery, orderBy }, { prisma }) => await searchInventory(searchQuery, orderBy, prisma),
    },
    Mutation: {
        createInventory: async (_, { input }, { user, prisma }) => create(input, user, prisma),
        deleteInventory: async (_, { ids }, { prisma }) => del(ids, prisma),
        updateInventory: async (_, { id, input }, { prisma }) => await update(id, input, prisma),
        grantInventoryAccess: async (_, { id, userIds }, { prisma }) => await addAllowUsers(id, userIds, prisma),
        revokeInventoryAccess: async (_, { id, userIds }, { prisma }) => await deleteAllowUsers(id, userIds, prisma),
    },
};

export default inventoryResolvers;