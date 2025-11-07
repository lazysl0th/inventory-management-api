import selectClient from '../infrastructure/prisma.js'

export const createComment = async (content, inventoryId, userId, client) => {
    return await client.comment.create({
        data: { content, inventoryId, userId },
        include: { user: true },
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

export const selectComments = (inventoryId, client) => {
    return client.comment.findMany({
        where: { inventoryId },
        orderBy: { createdAt: "asc" },
        include: { user: true },
    });
}