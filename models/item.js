import { createItemValue, updateItemValue } from '../models/itemValue.js'
import { generateCustomId, normalizeValue } from '../utils.js'

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
            //inventory: true, 
            owner: { select: { id: true, name: true, email: true } },
            _count: { select: { likes: true } },
        }
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

const prepareFieldsValue = (values, itemId, inventoryFields) => {
    const typeById = Object.fromEntries(inventoryFields.map(field => [field.id, field.type]));
    return values
        .filter(value => value.fieldId && value.value !== undefined && value.value !== null)
        .map(value => ({
            fieldId: value.fieldId,
            itemId,
            value: normalizeValue(value.value, typeById[value.fieldId]),
        }));
};

export const createItem = (data, customIdFormat, values, fields, client) => {
    return client.$transaction(async (tx) => {
        const customId = await generateCustomId(data.inventoryId, customIdFormat, tx);
        const item = await insertItem({ ...data, customId }, tx);
        const fieldsValue = prepareFieldsValue(values, item.id, fields);
        await createItemValue(fieldsValue, tx);
        return selectItemById(item.id, tx);
    })
}

const update = (itemId, customId, client) => {
    return client.item.update({
        where: { id: itemId },
        data: { customId, version: { increment: 1 }, updatedAt: new Date(), },
        include: { values: { include: { field: true } } },
    });
}

export const updateItem = async (itemId, customId, fields, values, client) => {
    const fieldsValues = prepareFieldsValue(values, itemId, fields);
    return client.$transaction(async (tx) => {
        for (const value of fieldsValues) await updateItemValue(value, tx);
        const u = await update(itemId, customId, tx);
        console.log(u);
        return u
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