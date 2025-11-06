import { Prisma } from '@prisma/client';
import { createInventoryFields, updateInventoryFields, deleteInventoryFields } from './inventoryFields.js';
import { updateTags } from './tag.js';

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

const deleteInventoryFieldsNew = async (inventoryId, newFields, updatedFields, client) => {
    const titles = [...newFields.map(field => field.title), ...updatedFields.map(field => field.title)].filter(Boolean);
    const where = titles.length > 0 ? { inventoryId, title: { notIn: titles } } : { inventoryId };
    return await client.inventoryField.deleteMany({ where });
};

const createInventoryFieldsNew = async (newFields, client) => {
    return await client.inventoryField.createMany({ data: newFields });
}

const updateInventoryFieldsNew = async (updatedFields, client) => {
    return await Promise.all(
        updatedFields.map(field =>
            client.inventoryField.update({
                where: { id: field.id },
                data: {
                    type: field.type,
                    description: field.description ?? null,
                    showInTable: !!field.showInTable,
                    order: field.order ?? 0,
                    isDeleted: !!field.isDeleted,
                },
            })
        )
    );
}

export async function updateNewInventoryService(
    inventoryId,
    tags,
    newFields,
    updatedFields,
    allowedUsers,
    input,
    client
) {
    return client.$transaction(async tx => {
        const { title, description, category, image, isPublic, customIdFormat } = input;
        if (tags.length) await createTags(tags, tx)
        const newTags = tags.length ? await findTags(tags, tx) : [];
        await deleteInventoryFieldsNew(inventoryId, newFields, updatedFields, tx);
        if (newFields.length) await createInventoryFieldsNew(newFields, tx)

        if (updatedFields.length) await updateInventoryFieldsNew(updatedFields, tx)

        const updated = await tx.inventory.update({
            where: { id: inventoryId },
            data: {
                title,
                description,
                category,
                image,
                isPublic,
                customIdFormat,
                version: { increment: 1 },
                tags: { set: newTags.map(t => ({ id: t.id })) },
                allowedUsers: { set: allowedUsers },
            },
            include: {
                owner: { select: { id: true, name: true } },
                tags: true,
                fields: { orderBy: { order: "asc" } },
                allowedUsers: { select: { id: true, name: true } },
            },
        });
        return updated
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