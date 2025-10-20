import { createComment, selectInventoryComments, selectItemComments } from '../models/comment.js';

export const create = (input, user) => {
    const { content, inventoryId, itemId } = input;
    return createComment(content, user.id, inventoryId, itemId);
}

export const getInventoryComments = (inventoryId) => {
    if (!inventoryId) return null;
    return selectInventoryComments(inventoryId);
}

export const getItemComments = (itemId) => {
    if (!itemId) return null;
    return selectItemComments(itemId);
}