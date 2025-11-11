import { Prisma } from '@prisma/client';
import { createInventoryField, updateInventoryField, deleteInventoryFields } from './inventoryFields.js';

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
          items: true,
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

export const selectInventoriesByCondition = (query, client) => {
    return client.inventory.findMany({
        include: {
            owner: { select: { id: true, name: true } },
            _count: { select: { items: true } },
            allowedUsers: { select: { id: true, name: true } },
        },
        ...query
    });
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

export const createInventory = async (tags, fields, owner, allowedUsers, inventoryBase, client) => {
    return client.inventory.create({
        data: {
            ...inventoryBase,
            owner: { connect: { id: owner.id } },
            tags: {
                connectOrCreate: tags.map((tag) => ({
                    where: { name: tag.name },
                    create: { name: tag.name },
                })),
            },
            fields: {
                create: fields.map((field) => ({
                    title: field.title,
                    type: field.type,
                    description: field.description,
                    showInTable: field.showInTable,
                    order: field.order,
                    isDeleted: field.isDeleted
                })),
            },
            allowedUsers: { connect: allowedUsers.map((user) => ({ id: user.id })) },
        },
        include: {
            tags: true,
            fields: true,
            allowedUsers: { select: { id: true, name: true, email: true }},
            owner: { select: { id: true, name: true }},
        },
    })
}

export const deleteInventory = async (inventoriesId, client) => {
    return await client.$transaction(async (tx) => {
        const deletedInventory = await selectInventoriesById(inventoriesId, tx);
        await tx.inventory.deleteMany({ where: { id: { in: inventoriesId } }, });
        return deletedInventory;
    })
}

const createTags = async (tags, client) => {
    return await client.tag.createMany({
        data: tags.map(tag => ({ name: tag.name })),
        skipDuplicates: true,
    });
}

const findTags = async (tags, client) => {
    return await client.tag.findMany({
        where: { name: { in: tags.map(tag => tag.name) } },
        select: { id: true },
    })
}

export async function updateInventory(
    inventoryId,
    tags,
    toCreate,
    toUpdate,
    toDeleteIds,
    allowedUsers,
    input,
    client
) {
    return client.$transaction(async (tx) => {
        const { title, description, category, image, isPublic, customIdFormat } = input;
        if (tags.length) await createTags(tags, tx);
        const newTags = tags.length ? await findTags(tags, tx) : [];
        if (toDeleteIds.length) await deleteInventoryFields(toDeleteIds, tx);
        for (const field of toUpdate) await updateInventoryField(field, tx);
        for (const field of toCreate) await createInventoryField(inventoryId, field, tx)

        const u = await tx.inventory.update({
            where: { id: inventoryId },
            data: {
                title,
                description,
                category,
                image,
                isPublic,
                customIdFormat,
                version: { increment: 1 },
                tags: { set: newTags.map((tag) => ({ id: tag.id })) },
                allowedUsers: { set: allowedUsers },
            },
            include: {
                owner: { select: { id: true, name: true } },
                tags: true,
                fields: { orderBy: { order: "asc" } },
                allowedUsers: { select: { id: true, name: true } },
            },
        });
        return u
    });
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

export const searchInventory = (searchQuery, orderBy, client) => {

    const safeOrder = orderBy.toUpperCase() === 'ASC' ? Prisma.sql`ASC` : Prisma.sql`DESC`

    return client.$queryRaw(
        Prisma.sql`
            SELECT
                i.id,
                i.title,
                i.description,
                i.image,
                json_build_object('id', u.id, 'name', u.name) AS "owner",
                ts_rank("searchVector", plainto_tsquery('english', ${searchQuery})) AS rank,
                ts_headline(
                'english',
                i.title,
                plainto_tsquery('english', ${searchQuery}),
                'StartSel=<mark>, StopSel=</mark>'
                ) AS "highlightedTitle",
                ts_headline(
                'english',
                i.description,
                plainto_tsquery('english', ${searchQuery}),
                'StartSel=<mark>, StopSel=</mark>'
                ) AS "highlightedDescription"
            FROM "Inventory" i
            JOIN "User" u ON u.id = i."ownerId"
            WHERE "searchVector" @@ plainto_tsquery('english', ${searchQuery})
            ORDER BY rank ${safeOrder};
        `
    )
};

export const updateSequencePart = (inventoryId, updatedFormat, client) => {
    return client.inventory.update({
        where: { id: inventoryId },
        data: { customIdFormat: updatedFormat },
    });
}