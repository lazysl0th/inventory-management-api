import selectClient from '../services/prisma.js';
import { createInventoryFields, updateInventoryFields, deleteInventoryFields } from './inventoryFields.js';
import { upsertTag, updateTags } from './tag.js';

export const selectAllInventories = (client) => {
    return selectClient(client).inventory.findMany({
        include: { 
            owner: { include: { roles: { include: { role: true, }, }, }, },
            fields: true,
            tags: true,
            allowedUsers: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' }
    });
}

export const selectInventoryById = (inventoryId, client) => {
    return selectClient(client).inventory.findUnique({
        where: { id: inventoryId },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          tags: true,
          fields: true,
          allowedUsers: { select: { id: true, name: true, email: true } },
        },
      });
}

export const selectInventoriesById = (inventoriesId, client) => {
    return selectClient(client).inventory.findMany({
        where: { id: { in: inventoriesId } },
        select: {
            id: true,
            title: true,
            ownerId: true,
            owner: { select: { id: true, name: true } },
        }
    });
}

const createTags = (tagsNames, client) => {
    return Promise.all(
        tagsNames.map(async(tagName) => {
            const tag = await upsertTag(tagName, client);
            return { id: tag.id }
        })
    )
}

export const insertInventory = (data, client) => {
    return selectClient(client).inventory.create({
        data: data,
        include: {
            owner: { select: { id: true, name: true } },
            tags: true,
            fields: { select: { type: true, title: true, order: true }},
        },
    })
}

export const createInventory = (tagsNames, fields, customIdFormatJSON, data, user) => {
    return selectClient().$transaction(async (tx) => {
        const tags = await createTags(tagsNames, tx);
        const inventory = await insertInventory({ ...data, tags: { connect: tags }, customIdFormat: customIdFormatJSON, ownerId: user.id }, tx);
        await createInventoryFields(inventory.id, fields, tx);
        return selectInventoryById(inventory.id, tx);
    })
}

export const deleteInventory = async (inventoriesId) => {
    return await selectClient().$transaction(async (tx) => {
        const deletedInventory = await selectInventoriesById(inventoriesId, tx);
        await selectClient(tx).inventory.deleteMany({ where: { id: { in: inventoriesId } }, });
        return deletedInventory;
    })
}

export const updateInventory = async (tagsNames, existingTagsId, fields, inventoryId, updateData) => {
    return await selectClient().$transaction(async (tx) => {
        await updateTags(tagsNames, existingTagsId, tx);
        await updateInventoryFields(fields.filter(field => field.id), tx);
        await createInventoryFields(inventoryId, fields.filter(field => !field.id), tx);
        await deleteInventoryFields(inventoryId, fields.map(field => field.title), tx);
        return selectClient(tx).inventory.update({
            where: { id: inventoryId },
            data: updateData,
            include: {
                owner: { select: { id: true, name: true } },
                tags: true,
                fields: { orderBy: { order: 'asc' } },
            }
        })
    })
}