import { checkLike, addLike, deleteLike, countLike, LikeByUser } from "../models/like.js";

export const toggleLike = async (userId, entityId) => {
    const like = await checkLike(userId, entityId);
    if (like) return deleteLike(like.id);
    else return addLike(userId, entityId);
}

export const getLikesCount = async (entityId, client) => {
    return await countLike(entityId, client);
}

export const isLikedByUser = async (userId, entityId, client) => {
    return !!(await LikeByUser(userId, entityId, client));
}