import { selectAllInventories, addAllowUsers, deleteAllowUsers } from '../../models/inventory.js';
import { create, del, update, select } from '../../services/inventory.js';

const inventoryResolvers = {
    Query: {
        inventories: async (_, __, {}) => { return await selectAllInventories(); },
        inventory: async(_, __, {id}) => select(id),
    },
    Mutation: {
        createInventory: async (_, { input }, context) => create(input, context),
        deleteInventory: async (_, { ids }) => del(ids),
        updateInventory: async (_, { id, input }) => await update(id, input),
        grantInventoryAccess: async (_, { id, userIds }) => await addAllowUsers(id, userIds),
        revokeInventoryAccess: async (_, { id, userIds }) => await deleteAllowUsers(id, userIds),
    },
};

export default inventoryResolvers;