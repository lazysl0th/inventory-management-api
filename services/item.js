
import { selectInventoryById, selectInventoryByApiToken } from '../models/inventory.js'
import { createItem, selectItemById, updateItem, deleteItem } from '../models/item.js'
import { findUserByParam } from '../models/user.js'
import { toggleLike, getLikesCount } from './like.js'
import NotFound from '../errors/notFound.js';
import BadRequest from '../errors/badRequest.js'
import Conflict from '../errors/conflict.js';
import { response, modelName } from '../constants.js';
import { checkCustomId, parseValue } from '../utils.js';



const { NOT_FOUND_RECORDS, BAD_REQUEST, CONFLICT } = response

export const create = async (input, user, client) => {
    const { inventoryId, values, apiToken } = input;
    try {
        const owner = apiToken ? await findUserByParam('email', user) : user;
        if (!owner) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.USER));
        const inventory = apiToken ? await selectInventoryByApiToken(apiToken, client) : await selectInventoryById(inventoryId, client);
        if (!inventory) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.INVENTORY));
        return await createItem({ inventoryId: inventory.id, ownerId: owner.id, }, inventory.customIdFormat, values, inventory.fields, client);
    } catch (e) {
        if (e.code == 'P2002') throw new Conflict(CONFLICT.text(modelName.ITEM));
        throw e
    }
}

export const update = async (itemId, input, expectedVersion, client) => {
    const inventory = await selectInventoryById(input.inventoryId, client);
    if (!inventory) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.INVENTORY));
    const item = await selectItemById(itemId, client);
    if (!checkCustomId(inventory.customIdFormat.summary, input.customId)) throw new BadRequest(BAD_REQUEST.text)
    if (!item) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.ITEM));
    if (item.version !== expectedVersion) throw new Conflict (CONFLICT.text('version'))
    const updatedItem = await updateItem(itemId, input.customId, inventory.fields, input.values, client)
    const typeById = Object.fromEntries(item.values.map(value => [value.field.id, value.field.type]));
    const parsedValues = updatedItem.values.map(value => ({
        ...value,
        value: parseValue(value.value, typeById[value.field.id]),
    }));
    return {
        ...item,
        values: parsedValues,
    };
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

export const selectItem = async (id, client) => {
    try{
        const item = await selectItemById(id, client);
        if (!item) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.ITEM));
        const typeById = Object.fromEntries(item.values.map(value => [value.field.id, value.field.type]));
        const parsedValues = item.values.map(value => ({
            ...value,
            value: parseValue(value.value, typeById[value.field.id]),
        }));
        return {
            ...item,
            values: parsedValues,
        };
    } catch(e) {
        console.log(e)
    }
}