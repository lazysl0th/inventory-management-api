import { selectAllInventories } from '../models/inventory.js';
import { create, del, update, selectInventory } from '../services/inventory.js';
import { roles } from '../constants.js'

const resolvers = {
    Query: {
        inventories: async (_, __, {}) => { return await selectAllInventories(); },
        inventory: async(_, __, {id}) => selectInventory(id),
    },
    Mutation: {
        createInventory: async (_, { input }, {}) => create(input),
        deleteInventory: async (_, { ids }) => del(ids),
        updateInventory: async (_, { id, input }, {}) => update(id, input)
    },
};

export default resolvers;