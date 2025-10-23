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

export const selectInventoryComments = (inventoryId, client) => {
    return selectClient(client).inventory.findUnique({ where: { id: inventoryId } });
}

export const selectItemComments = (itemId, client) => {
    if (!itemId) return null;
    return selectClient(client).item.findUnique({ where: { id: itemId } });
}