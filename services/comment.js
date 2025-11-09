import { createComment, selectComments, selectInventoryComments, selectItemComments } from '../models/comment.js';

export const create = async (input, user, client) => {
    const { content, inventoryId } = input;
    return await createComment(content, inventoryId, user.id, client);
}

export const get = (inventoryId, client) => {
    return selectComments (inventoryId, client)
}

export const getItemComments = (itemId) => {
    if (!itemId) return null;
    return selectItemComments(itemId);
}