import crypto from 'crypto';
import { createInventory, deleteInventory, selectInventoryById, updateInventory } from "../models/inventory.js";
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

export const selectInventory = async (inventoryId) => {
    const inventory = await selectInventoryById(inventoryId); 
    const isOwner = currentUser && currentUser.id === inv.ownerId;
    const isAdmin = user.roles.some((userRole) => userRole.includes(roles.ADMIN));
    const result = { ...inventory };

    if (!isOwner && !isAdmin) {
        result.allowedUsers = [];

        if (inv.customIdFormat?.parts) {
            const parts = inv.customIdFormat.parts.map((p) => p.type || '?');
            result.customIdFormat = { summary: parts.join(' + '), parts: null, };
        } else {
            result.customIdFormat = { summary: 'Default', parts: null };
        }
    } else {
        if (inv.customIdFormat?.parts) {
            const parts = inv.customIdFormat.parts;
            result.customIdFormat = {
                parts,
                summary: parts.map((p) => p.type || '?').join(' + '),
        };
        } else {
            result.customIdFormat = { summary: 'Default', parts: [] };
        }
    }
    if (result.createdAt instanceof Date) result.createdAt = result.createdAt.toISOString();
    if (result.updatedAt instanceof Date) result.updatedAt = result.updatedAt.toISOString();
}

export const create = async (input, context) => {
    const { user } = context;
    const { tagsNames, fields, customIdFormat, ...data} = input;
    const customIdFormatJSON = createCustomIdFormatJSON(customIdFormat);
    try {
        const inventory = await createInventory(tagsNames, fields, customIdFormatJSON, data, user);
        return inventory;
    } catch (e) {
        if (e.code === 'P2002') throw new Conflict(CONFLICT.text(modelName.INVENTORY_FIELD));
    }
}

export const del = (inventoryIds) => {
    return deleteInventory(inventoryIds);
}

export const update = async (inventoryId, input) => {
    const { tagsNames, fields, title, description, category, image, isPublic, customIdFormat } = input;
    const inventory = await selectInventoryById(inventoryId);
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
    return updateInventory(tagsNames, existingTagsId, fields, inventoryId, updateData);
}