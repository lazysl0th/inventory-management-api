import crypto from 'crypto';
import { selectInventoryById } from '../models/inventory.js'
import { selectLastItem, createItem, selectItemById, updateItem, deleteItem} from '../models/item.js'
import { toggleLike, getLikesCount } from '../services/like.js'
import NotFound from '../errors/notFound.js';
import { response, modelName } from '../constants.js';

const { NOT_FOUND_RECORDS } = response

const generateRandomNumber = (numberSymbol, maxValue) => {
    const number = crypto.randomInt(0, maxValue);
    return number.toString().padStart(numberSymbol, '0');
}

const generateNBitRandomNumberBit = (bit) => {
    const bytes = Math.ceil(bit/8);
    const buffer = crypto.randomBytes(bytes);
    let numBigInt = 0n;
    for (let i = 0; i < bytes; i++) {
        numBigInt = (numBigInt << 8n) | BigInt(buffer[i]);
    }
    const mask = (1n << BigInt(bit)) - 1n;
    return numBigInt & mask;
}

const generateSequenceNumber = (inventoryId, digits) => {
    const lastItem = selectLastItem(inventoryId);
    const next = (lastItem?.id || 0) + 1;
    return String(next).padStart(digits, '0');
}

const generateCustomId = async (inventory) => {
    const customIdFormat = inventory.customIdFormat.parts;
    let id = '';
    for (const part of customIdFormat) {
        switch (part.type) {
        case 'TEXT':
            id += part.value || '';
            break;
        case 'RANDOM6': {
            id += generateRandomNumber(6, 1_000_000);
            break;
        }
        case 'RANDOM9': {
            id += generateRandomNumber(9, 1_000_000_000);
            break;
        }
        case 'RANDOM20': {
            id += generateNBitRandomNumberBit(20);
            break;
        }
        case 'RANDOM32': {
            id += generateNBitRandomNumberBit(32);
            break;
        }
        case 'GUID':
            id += crypto.randomUUID();
            break;
        case 'DATE':
            id += dayjs().format(part.format || 'YYYYMMDD');
            break;
        case 'SEQUENCE': {
            id += generateSequenceNumber(inventory.id, part.digits);
            break;
        }
        default:
            return 'ITEM-' + crypto.randomBytes(3).toString('hex').toUpperCase();
        }
    }
    return id;
}

export const create = async (input, user) => {
    const { inventoryId, values } = input;
    const inventory = await selectInventoryById(inventoryId);
    if (!inventory) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.INVENTORY));
    const customId = await generateCustomId(inventory);
    const data = {
        customId: customId,
        inventoryId: inventoryId,
        ownerId: user.id,
    }
    const item = await createItem(data, values);
    console.log(item);
    return item;
}

export const update = async (itemId, input) => {
    const item = await selectItemById(itemId);
    if (!item) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.ITEM));
    const updatedItem = await updateItem(itemId, input.values)
    return updatedItem;
}

export const del = async (itemIds) => {
    return deleteItem(itemIds);
}

export const like = async (itemId, user) => {
    const { isLiked } = await toggleLike(user.id, itemId);
    const likesCount = await getLikesCount(itemId);
    const item = await selectItemById(itemId);
    return {
        ...item,
        likesCount,
        likedByMe: isLiked,
    };
}