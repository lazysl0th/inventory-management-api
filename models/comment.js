import selectClient from '../infrastructure/prisma.js'

export const createComment = (content, userId, inventoryId, itemId, client) => {
    return selectClient(client).comment.create({
        data: {
            content,
            userId: userId,
            inventoryId: inventoryId,
            itemId: itemId,
        },
        include: {
            user: true,
            inventory: true,
            item: true,
        },
    });
}

export const selectUserComments = (userId, client) => {
    return selectClient(client).user.findUnique({ where: { id: userId } });
}

export const selectInventoryComments = (inventoryId, client) => client.commet.findUnique({ where: { inventoryId } });

export const selectItemComments = (itemId, client) => {
    if (!itemId) return null;
    return selectClient(client).item.findUnique({ where: { id: itemId } });
}

export const selectComments = (typeId, id, client) => {
    return client.comment.findMany({
        where: { [typeId]: id },
        orderBy: { createdAt: "desc" },
        include: { user: true },
    });
}