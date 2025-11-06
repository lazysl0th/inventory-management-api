import { getPrismaClient } from '../infrastructure/prisma.js';
import { createItemValue, updateItemValue } from '../models/itemValue.js'
import { generateCustomId } from '../services/item.js'

export const selectAllItems = (inventoryId, client) => {
    return client.item.findMany({
        where: { inventoryId },
        include: { values: { include: { field: true } } },
        orderBy: { createdAt: 'desc' }
    });
}

export const selectItemById = (itemId, client) => {
    return client.item.findUnique({
        where: { id: itemId },
        include: { 
            values: { include: { field: true } }, 
            inventory: true, 
            owner: { select: { id: true, name: true, email: true } } }
    })
}

export const selectItemsById = (itemIds, client) => {
    return client.item.findMany({
        where: { id: { in: itemIds } },
        include: { values: { include: { field: true } }, inventory: true }
    })
}

export const selectLastItem = async (inventoryId, client) => {
    return await client.item.findFirst({
        where: { inventoryId: inventoryId },
        orderBy: { id: 'desc' },
        select: { id: true, customId: true }
    });
}

const insertItem = (data, client) => {
    return client.item.create({ 
        data: data,
        include: { values: { include: { field: true } } }
    })
}

export const createItem = (data, customIdFormat, values, client) => {
    return client.$transaction(async (tx) => {
        const customId = await generateCustomId(data.inventoryId, customIdFormat, tx);
        const item = await insertItem({ ...data, customId }, tx);
        await createItemValue(item.id, values, tx);
        return selectItemById(item.id, tx);
    })
}

/*export const updateItem = (itemId, values) => {
    return selectClient().$transaction(async (tx) => {
        await deleteItemValue(itemId, tx);
        await createItemValue(itemId, values, tx)
        return selectClient(tx).item.update({
          where: { id: itemId },
          data: { version: { increment: 1 } },
          include: { values: { include: { field: true } } }
        });
    })
}*/



const update = (itemId, client) => {
    return client.item.update({
        where: { id: itemId },
        data: { version: { increment: 1 } },
        include: { values: { include: { field: true } } },
    });
}

export const updateItem = async (itemId, values, client) => {
    return client.$transaction(async (tx) => {
        for (const value of values) await updateItemValue(itemId, value, tx);
        return await update(itemId, tx);
  });
};

export const deleteItem = async (itemIds, client) => {
    return await client.$transaction(async (tx) => {
        const deletedItems = await selectItemsById(itemIds, tx);
        await getPrismaClient(tx).item.deleteMany({ where: { id: { in: itemIds } }, });
        return deletedItems;
    })
}

export const itemsCount = (inventoryId, client) => {
    return client.item.count({
        where: { inventoryId },
    });
}