import selectClient from '../services/prisma.js'

export const checkLike = async(userId, entityId, client) => {
    return await selectClient(client).like.findUnique({
        where: { userId_itemId: { userId, itemId: entityId } },
    });
}

export const addLike = async(userId, entityId, client) => {
    await selectClient(client).like.create({ 
        data: { userId, itemId: entityId, },
        include: { user: true, item: true, },
    });
    return { isLiked: true };
}

export const deleteLike = async(likeId, client) => {
    await selectClient(client).like.delete({ where: { id: likeId } });
    return { isLiked: false };
}

export const countLike = (entityId, client) => {
    return selectClient(client).like.count({ where: { itemId: entityId }, });
}

export const LikeByUser = (userId, entityId, client) => {
    return selectClient(client).like.findUnique({ where: { userId_itemId: { userId, itemId: entityId, } }, });
}