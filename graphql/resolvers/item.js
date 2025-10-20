import { selectAllItems, selectItemById } from '../../models/item.js';
import { create, update, del } from '../../services/item.js'

const itemResolvers = {
    Query: {
        items: async (_, { inventoryId }) => selectAllItems(inventoryId),
        item: async (_, { id }) => selectItemById(id),
    },
    Mutation: {
        createItem: async (_, { input }, context) => create(input, context),
        deleteItem: async (_, { ids }) => del(ids),
        updateItem: async (_, { id, input }) => update(id, input)
    },
};

export default itemResolvers;