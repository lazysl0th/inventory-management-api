import { 
    createInventory,
    deleteInventory,
    selectInventoryById,
    updateInventory,
    selectInventoriesByCondition,
} from "../models/inventory.js";
import { itemsCount, selectAllItems } from '../models/item.js'
import { calculateFieldStats } from './stats.js'
import NotFound from '../errors/notFound.js';
import Conflict from '../errors/conflict.js';
import { response, modelName, orderMapping, } from '../constants.js';

const { NOT_FOUND_RECORDS, CONFLICT } = response

const createCustomIdFormatJSON = (customIdFormat) => {
    return {
        parts: customIdFormat || [],
        summary: (customIdFormat || []).map((part) => part.type || '').join(' + ') || 'Default',
    }
}

export const create = async (input, user, client) => {
    const { tagsNames, fields, customIdFormat, ...data} = input;
    const customIdFormatJSON = createCustomIdFormatJSON(customIdFormat);
    try {
        const inventory = await createInventory(tagsNames, fields, customIdFormatJSON, data, user, client);
        return inventory;
    } catch (e) {
        if (e.code === 'P2002') throw new Conflict(CONFLICT.text(modelName.INVENTORY_FIELD));
    }
}

export const del = (inventoryIds, prisma) => {
    return deleteInventory(inventoryIds, prisma);
}

export const update = async (inventoryId, input, prisma) => {
    const { tagsNames, fields, title, description, category, image, isPublic, customIdFormat } = input;
    const inventory = await selectInventoryById(inventoryId, prisma);
    if (!inventory) throw new NotFound(NOT_FOUND_RECORDS.text);
    const existingTagsId = inventory.tags.map((tag) => tag.id);
    const updateData = {
        title: title ?? inventory.title,
        description: description ?? inventory.description,
        category: category ?? inventory.category,
        image: image ?? inventory.image,
        isPublic: isPublic ?? inventory.isPublic,
        customIdFormat: customIdFormat
            ? createCustomIdFormatJSON(customIdFormat)
            : inventory.customIdFormat,
        version: { increment: 1 },
        updatedAt: new Date(),
        };
    return updateInventory(tagsNames, existingTagsId, fields, inventoryId, updateData, prisma);
}

export const grantAccess = () => {

}

export const revokeAccess = () => {

}

export const selectInventories = (sortName, order, skip, take, client) => {
    const orderBy = orderMapping[sortName]?.(order)
    return selectInventoriesByCondition(orderBy, take, skip, client)
}

export const getItemsCount = (parent, client) => {
    if (parent._count?.items !== undefined) return parent._count.items;
    return itemsCount(parent.id, client);
}

const groupFieldsByType = (fields) => fields.reduce((acc, field) => {
    (acc[field.type] ??= []).push(field);
    return acc;
}, {});

export const getStats = async (parent, client) => {
    const items = await selectAllItems(parent.id, client);
    const fieldsByType = groupFieldsByType(parent.fields);
    return calculateFieldStats(fieldsByType, items);
}