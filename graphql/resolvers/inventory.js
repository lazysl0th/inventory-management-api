import { selectAllInventories } from '../../models/inventory.js';
import { create, del, update, selectInventory } from '../../services/inventory.js';

const inventoryResolvers = {
    Query: {
        inventories: async (_, __, {}) => { return await selectAllInventories(); },
        inventory: async(_, __, {id}) => selectInventory(id),
    },
    Mutation: {
        createInventory: async (_, { input }, context) => create(input, context),
        deleteInventory: async (_, { ids }) => del(ids),
        updateInventory: async (_, { id, input }, {}) => await update(id, input)
    },
};

export default inventoryResolvers;