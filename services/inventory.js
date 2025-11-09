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
import { response, conditions } from '../constants.js';

const { NOT_FOUND_RECORDS, CONFLICT } = response

const createCustomIdFormatJSON = (customIdFormat) => {
    return {
        parts: (customIdFormat || []).map((part) => part.type || '').join(' + ') || 'Default',
        summary: (customIdFormat || [])
    }
}

export const create = async (input, client) => {
    const { tags, fields, owner, allowedUsers, ...inventoryBase } = input;
    try {
        return await createInventory(tags, fields, owner, allowedUsers, inventoryBase, client);
    } catch (e) {
        console.log(e)
    }
}

export const del = (inventoryIds, client) => {
    return deleteInventory(inventoryIds, client);
}

export const update = async (inventoryId, input, expectedVersion, client) => {
    const { tags, fields, allowedUsers, ...inventoryBase } = input;
    const inventory = await selectInventoryById(inventoryId, client);
    if (!inventory) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.INVENTORY));
    if (inventory.version !== expectedVersion) throw new Conflict (CONFLICT.text('version'))

    const existingIds = new Set(inventory.fields.map(f => f.id));

    const toCreate = [];
    const toUpdate = [];
    const incomingIds = new Set();

    for (const field of fields) {
        const base = {
            title: field.title,
            type: field.type,
            description: field.description ?? null,
            showInTable: !!field.showInTable,
            order: field.order ?? 0,
            isDeleted: !!field.isDeleted,
        };

        if (field.id && existingIds.has(field.id)) {
            toUpdate.push({ id: field.id, ...base });
            incomingIds.add(field.id);
        } else {
            toCreate.push({ ...base, inventoryId });
        }
    }

  const toDeleteIds = inventory.fields.filter(field => !incomingIds.has(field.id)).map(field => field.id);

  return updateInventory(
    inventoryId,
    tags,
    toCreate,
    toUpdate,
    toDeleteIds,
    allowedUsers,
    inventoryBase,
    client
  );
};


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
    const where = combineWhereConditions(whereParts, params.logic)
    if (where) query.where = where;
    return query;
}

export async function selectInventories(params, prisma) {
    const query = buildQuery(params);
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