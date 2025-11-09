import { checkLike, addLike, deleteLike, countLike, LikeByUser } from "../models/like.js";

export const toggleLike = async (userId, entityId, client) => {
    const like = await checkLike(userId, entityId, client);
    if (like) return await deleteLike(like.id, client);
    else return await addLike(userId, entityId, client);
}

export const getLikesCount = async (entityId, client) => {
    return await countLike(entityId, client);
}

export const isLikedByUser = async (userId, entityId, client) => {
    if (!userId) return false;
    return !!(await LikeByUser(userId, entityId, client));
}