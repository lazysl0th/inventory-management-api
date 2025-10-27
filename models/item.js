import selectClient from '../infrastructure/prisma.js';
import { createItemValue, deleteItemValue } from '../models/itemValue.js'

export const selectAllItems = (inventoryId, client) => {
    return client.item.findMany({
        where: { inventoryId },
        include: { values: { include: { field: true } } },
        orderBy: { createdAt: 'desc' }
    });
}

export const selectItemById = (itemId, client) => {
    return selectClient(client).item.findUnique({
        where: { id: itemId },
        include: { values: { include: { field: true } }, inventory: true }
    })
}

export const selectItemsById = (itemIds, client) => {
    return selectClient(client).item.findMany({
        where: { id: { in: itemIds } },
        include: { values: { include: { field: true } }, inventory: true }
    })
}

export const selectLastItem = (inventoryId, client) => {
    return selectClient(client).item.findFirst({
        where: { inventoryId: inventoryId },
        orderBy: { id: 'desc' },
        select: { id: true }
    });
}

const insertItem = (data, client) => {
    return selectClient(client).item.create({ 
        data: data,
        include: { values: { include: { field: true } } }
    })
}

export const createItem = (data, values) => {
    return selectClient().$transaction(async (tx) => {
        const item = await insertItem(data, tx);
        await createItemValue(item.id, values, tx);
        return selectItemById(item.id, tx);
    })
}

export const updateItem = (itemId, values) => {
    return selectClient().$transaction(async (tx) => {
        await deleteItemValue(itemId, tx);
        await createItemValue(itemId, values, tx)
        return selectClient(tx).item.update({
          where: { id: itemId },
          data: { version: { increment: 1 } },
          include: { values: { include: { field: true } } }
        });
    })
}

export const deleteItem = async (itemIds) => {
    return await selectClient().$transaction(async (tx) => {
        const deletedItems = await selectItemsById(itemIds, tx);
        await selectClient(tx).item.deleteMany({ where: { id: { in: itemIds } }, });
        return deletedItems;
    })
}

export const itemsCount = (inventoryId, client) => {
    return client.item.count({
        where: { inventoryId },
    });
}