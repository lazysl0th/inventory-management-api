
import { selectInventoryById } from '../models/inventory.js'
import { createItem, selectItemById, updateItem, deleteItem} from '../models/item.js'
import { toggleLike, getLikesCount } from './like.js'
import NotFound from '../errors/notFound.js';
import BadRequest from '../errors/badRequest.js'
import Conflict from '../errors/conflict.js';
import { response, modelName } from '../constants.js';
import { checkCustomId } from '../utils.js';

const { NOT_FOUND_RECORDS, BAD_REQUEST, CONFLICT } = response

export const create = async (input, user, client) => {
    const { inventoryId, values } = input;
    try {
        const inventory = await selectInventoryById(inventoryId, client);
        if (!inventory) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.INVENTORY));
        return await createItem({ inventoryId: inventoryId, ownerId: user.id, }, inventory.customIdFormat, values, client);
    } catch (e) {
        if (e.code == 'P2002') throw new Conflict(CONFLICT.text(modelName.ITEM));
        throw e
    }
}

export const update = async (itemId, input, expectedVersion, client) => {
    try {
        const inventory = await selectInventoryById(input.inventoryId, client);
        if (!inventory) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.INVENTORY));
        const item = await selectItemById(itemId, client);
        console.log(!checkCustomId(inventory.customIdFormat.summary, input.customId))
        console.log(inventory.customIdFormat.summary, input.customId)
        if (checkCustomId(inventory.customIdFormat.summary, item.customId)) throw new BadRequest(BAD_REQUEST.text)
        if (!item) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.ITEM));
        if (item.version !== expectedVersion) throw new Conflict (CONFLICT.text('version'))
        return await updateItem(itemId, input, client)
    } catch (e) {
        console.log(e);
    }
}

export const del = async (itemIds, client) => {
    return deleteItem(itemIds, client);
}

export const like = async (itemId, user, client) => {
    const { isLiked } = await toggleLike(user.id, itemId, client);
    const likesCount = await getLikesCount(itemId, client);
    return {
        id: itemId,
        likesCount,
        likedByMe: isLiked,
    };
}