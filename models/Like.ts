export const checkLike = (userId, entityId, client) => {
    return client.like.findUnique({
        where: { userId_itemId: { userId, itemId: entityId } },
    });
}

export const addLike = async(userId, entityId, client) => {
    return await client.like.create({ 
        data: { userId, itemId: entityId, },
    })
}

export const deleteLike = (likeId, client) => {
    return client.like.delete({ where: { id: likeId } });
}

export const countLike = (entityId, client) => {
    return client.like.count({ 
        where: { itemId: entityId },
    });
}

export const LikeByUser = (userId, entityId, client) => {
    return client.like.findUnique({ where: { userId_itemId: { userId, itemId: entityId, } }, });
}