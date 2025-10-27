import { createComment, selectComments, selectInventoryComments, selectItemComments } from '../models/comment.js';
import { typeId } from '../constants.js';

const {INVENTORY, ITEM} = typeId;

export const create = (input, user) => {
    const { content, inventoryId, itemId } = input;
    return createComment(content, user.id, inventoryId, itemId);
}

export const get = (args, client) => {
    const typeId = Object.keys(args).find((key) => args[key] != null);
    return selectComments (typeId, args[typeId], client)
}

export const getItemComments = (itemId) => {
    if (!itemId) return null;
    return selectItemComments(itemId);
}