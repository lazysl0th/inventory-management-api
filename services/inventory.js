import { 
    createInventory,
    deleteInventory,
    selectInventoryById,
    updateInventory,
    selectInventoriesByCondition,
    selectInventoriesOrderByItemCounts
} from "../models/inventory.js";
import NotFound from '../errors/notFound.js';
import Conflict from '../errors/conflict.js';
import { response, modelName } from '../constants.js';

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

export const selectInventories = async (condition, client) => {
    const { where = {}, orderBy = {}, take, skip } = condition;
        
    const prismaWhere = {};
    
    if (where.ownerId) prismaWhere.ownerId = where.ownerId;
    if (where.isPublic !== undefined) prismaWhere.isPublic = where.isPublic;
    if (where.search) {
      prismaWhere.OR = [
        { title: { contains: where.search, mode: 'insensitive' } },
        { description: { contains: where.search, mode: 'insensitive' } },
      ];
    }

    if (orderBy.itemsCount) return selectInventoriesOrderByItemCounts(where.ownerId, where.isPublic, orderBy.itemsCount, take, client);

    const inventories = await selectInventoriesByCondition(prismaWhere, orderBy, take, skip, client);

    return inventories.map((inventory) => ({
      ...inventory,
      itemsCount: inventory._count.items,
    }));
}