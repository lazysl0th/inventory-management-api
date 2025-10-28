import { 
    createInventory,
    deleteInventory,
    selectInventoryById,
    updateInventory,
    selectInventoriesByCondition
} from "../models/inventory.js";
import { itemsCount, selectAllItems } from '../models/item.js'
import { calculateFieldStats } from './stats.js'
import NotFound from '../errors/notFound.js';
import Conflict from '../errors/conflict.js';
import { response, modelName, conditions } from '../constants.js';

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

const buildConditionPart = (key, value, params) => {
    if (!conditions[key]) return {};
    const fn = conditions[key];
    const part = key === 'sortName' ? fn(value, params.order || 'desc') : fn(value);
    return part;
}

const mergeQuerySections = (query, part) => {
    Object.entries(part).forEach(([section, obj]) => {
        if (obj !== Object(obj)) query[section] = obj;
        else query[section] = { ...(query[section] || {}), ...obj };
    });
    return query;
}

const collectQueryParts = (whereParts, params) => {
    return Object.entries(params).reduce((query, [key, value]) => {
        const part = buildConditionPart(key, value, params);
        if (part.where) whereParts.push(part.where);
        return mergeQuerySections(query, part);
    }, {});
}

const combineWhereConditions = (whereParts, logic ) => {
    if (whereParts.length) {
        return logic === 'OR' && whereParts.length > 1 ? { OR: whereParts } : Object.assign({}, ...whereParts);
    }
}

const buildQuery = (params) => {
    const whereParts = [];
    const query = collectQueryParts(whereParts, params);
    query.where = combineWhereConditions(whereParts, params.logic)
    return query;
}

export async function selectInventories(params, prisma) {
    const query = buildQuery(params);
    console.log(query);
    return selectInventoriesByCondition(query, prisma)
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