import { 
    createInventory,
    deleteInventory,
    selectInventoryById,
    updateInventory,
    selectInventoriesByCondition,
    updateNewInventoryService
} from "../models/inventory.js";
import { itemsCount, selectAllItems } from '../models/item.js'
import { calculateFieldStats } from './stats.js'
import NotFound from '../errors/notFound.js';
import Conflict from '../errors/conflict.js';
import { response, modelName, conditions } from '../constants.js';

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
        return createInventory(tags, fields, owner, allowedUsers, inventoryBase, client);
    } catch (e) {
        if (e.code === 'P2002') throw new Conflict(CONFLICT.text(modelName.INVENTORY_FIELD));
    }
}

export const del = (inventoryIds, client) => {
    return deleteInventory(inventoryIds, client);
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
    
    const updated = updateInventory(tagsNames, existingTagsId, fields, inventoryId, updateData, prisma);
    return updated;
}

export const newUpd = async (inventoryId, input, expectedVersion, prisma) => {
  const { tags, fields, owner, allowedUsers, ...inventoryBase } = input;

  const inventory = await selectInventoryById(inventoryId, prisma);
  if (!inventory) throw new Error("NOT_FOUND");

  if (inventory.version !== expectedVersion) {
    const err = new Error("VERSION_CONFLICT");
    err.code = "VERSION_CONFLICT";
    err.meta = {
      currentVersion: inventory.version,
      expectedVersion,
    };
    throw err;
  }

  const inventoryFields = new Map(
    inventory.fields.map((field) => [field.title, field.id])
  );

  const newInventoryFields = fields
    .filter((f) => !inventoryFields.has(f.title))
    .map((field) => ({
      inventoryId,
      title: field.title,
      type: field.type,
      description: field.description ?? null,
      showInTable: field.showInTable ?? false,
      order: typeof field.order === "number" ? field.order : 0,
      isDeleted: !!field.isDeleted,
    }));

  const updatedInventoryFields = fields.filter((f) =>
    inventoryFields.has(f.title)
  );

  try {
    return await updateNewInventoryService(
      inventoryId,
      tags,
      inventoryFields,
      newInventoryFields,
      updatedInventoryFields,
      allowedUsers,
      inventoryBase,
      prisma
    );
  } catch (e) {
    if (e.code === "VERSION_CONFLICT") {
      throw new Error(
        `Version conflict: current=${e.meta.currentVersion}, expected=${e.meta.expectedVersion}`
      );
    }
    if (e.message === "NOT_FOUND") throw new Error("Inventory not found");
    throw e;
  }
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