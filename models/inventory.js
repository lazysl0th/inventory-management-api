import { Prisma } from '@prisma/client';
import { createInventoryFields, updateInventoryFields, deleteInventoryFields } from './inventoryFields.js';
import { upsertTag, updateTags } from './tag.js';

export const selectAllInventories = (client) => {
    return client.inventory.findMany({
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
    return client.inventory.findUnique({
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
    return client.inventory.findMany({
        where: { id: { in: inventoriesId } },
        select: {
            id: true,
            title: true,
            ownerId: true,
            owner: { select: { id: true, name: true } },
        }
    });
}

export const selectInventoriesByCondition = (where, orderBy, take, skip, client) => {
    return client.inventory.findMany({
        include: {
            owner: { select: { id: true, name: true } },
            _count: { select: { items: true } },
        },
        where,
        orderBy,
        take,
        skip,
    });
}

export const selectInventoriesOrderByItemCounts = (ownerId, isPublic, itemsCount, take, client) => {
    return client.$queryRaw`
        SELECT i.id, i.title, i.description, i.image, i."createdAt",
               json_build_object('id', u.id, 'name', u.name) AS "owner",
               COUNT(it.id)::int AS "itemsCount"
        FROM "Inventory" i
        JOIN "User" u ON u.id = i."ownerId"
        LEFT JOIN "Item" it ON it."inventoryId" = i.id
        ${ownerId ? Prisma.sql`WHERE i."ownerId" = ${ownerId}` : Prisma.empty}
        ${isPublic !== undefined ? Prisma.sql`AND i."isPublic" = ${isPublic}` : Prisma.empty}
        GROUP BY i.id, u.id
        ORDER BY COUNT(it.id) ${Prisma.raw(itemsCount.toUpperCase())}
        ${take ? Prisma.sql`LIMIT ${take}` : Prisma.empty};
      `;
}

const createTags = (tagsNames, client) => {
    return Promise.all(
        tagsNames.map(async (tagName) => {
            const tag = await upsertTag(tagName, client);
            return { id: tag.id }
        })
    )
}

export const insertInventory = (data, client) => {
    return client.inventory.create({
        data: data,
        include: {
            owner: { select: { id: true, name: true } },
            tags: true,
            fields: { select: { type: true, title: true, order: true }},
        },
    })
}

export const createInventory = (tagsNames, fields, customIdFormatJSON, data, user, client) => {
    return client.$transaction(async (tx) => {
        const tags = await createTags(tagsNames, tx);
        const inventory = await insertInventory({ ...data, tags: { connect: tags }, customIdFormat: customIdFormatJSON, ownerId: user.id }, tx);
        await createInventoryFields(inventory.id, fields, tx);
        return selectInventoryById(inventory.id, tx);
    })
}

export const deleteInventory = async (inventoriesId, client) => {
    return await client.$transaction(async (tx) => {
        const deletedInventory = await selectInventoriesById(inventoriesId, tx);
        await tx.inventory.deleteMany({ where: { id: { in: inventoriesId } }, });
        return deletedInventory;
    })
}

export const updateInventory = async (tagsNames, existingTagsId, fields, inventoryId, updateData, client) => {
    return await client.$transaction(async (tx) => {
        await updateTags(tagsNames, existingTagsId, tx);
        await updateInventoryFields(fields.filter(field => field.id), tx);
        await createInventoryFields(inventoryId, fields.filter(field => !field.id), tx);
        await deleteInventoryFields(inventoryId, fields.map(field => field.title), tx);
        return tx.inventory.update({
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

export const addAllowUsers = (inventoryId, userIds, client) => {
    return client.inventory.update({
        where: { id: inventoryId },
        data: { allowedUsers: { connect: userIds.map(id => ({ id })) } },
        include: {
            allowedUsers: true,
            owner: true,
            tags: true,
            fields: true,
        },
    });
}

export const deleteAllowUsers = (inventoryId, userIds, client) => {
    return client.inventory.update({
        where: { id: inventoryId },
        data: { allowedUsers: { disconnect: userIds.map(id => ({ id })) } },
        include: {
            allowedUsers: true,
            owner: true,
            tags: true,
            fields: true,
        },
    });
}