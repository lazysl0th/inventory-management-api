import crypto from 'crypto';
import dayjs from "dayjs";
import { selectInventoryById, updateSequencePart } from '../models/inventory.js'
import { createItem, selectItemById, updateItem, deleteItem} from '../models/item.js'
import { toggleLike, getLikesCount } from './like.js'
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
    console.log(numBigInt & mask);
    return numBigInt & mask;
}

const formatId = (id, format) => {
    console.log(format);
    switch (format) {
        case 'D1':
        case 'D2':
        case 'D3':
        case 'D4': {
            const len = parseInt(format.slice(1), 10);
            return String(id).length < len ? String(id).padStart(len, '0') : id;
        }
        case 'X5':
        case 'X8': return id.toString(16);
        case 'YYYY':
        case "YYYYMM":
        case "YYYYMMDD":
        case "YYYYMMDD-HHmm":
        case "YYYYMMDD-HHmmss": return dayjs().format(format)
        default:
            return id;
    };
}

const generateSequenceNumber = async (inventoryId, customIdFormat, currentPart, client) => {
    const start = Number(currentPart.value) ?? 1;
    const current = (Number(currentPart.currentSequence) ?? start - 1) + 1;
    const updatedParts = customIdFormat.parts.map((part) => part.guid === currentPart.guid ? { ...part, currentSequence: current } : part);
    const updatedFormat = { ...customIdFormat, parts: updatedParts };
    await updateSequencePart(inventoryId, updatedFormat, client)
    return current;
}

export const generateCustomId = async (inventoryId, customIdFormat, client) => {
    const partsId = [];
    for (const part of customIdFormat.parts) {
        let partId
        switch (part.type) {
            case 'TEXT':
                partId = part.format || '';
                break;
            case 'RANDOM6': {
                partId = generateRandomNumber(6, 1_000_000);
                break;
            }
            case 'RANDOM9': {
                partId = generateRandomNumber(9, 1_000_000_000);
                break;
            }
            case 'RANDOM20': {
                partId = generateNBitRandomNumberBit(20);
                break;
            }
            case 'RANDOM32': {
                partId = generateNBitRandomNumberBit(32);
                break;
            }
            case 'GUID':
                partId = crypto.randomUUID();
                break;
            case 'SEQUENCE': {
                partId = await generateSequenceNumber(inventoryId, customIdFormat, part, client);
                break;
            }
        }

        if (part.format && part.format !== '') partId = formatId(partId, part.format);

        if (part.separator && part.separator !== '') {
            if (part.position === 'prefix') partId = part.separator + partId
            else partId = partId + part.separator;
        }
        partsId.push(partId);
    }
    const id = partsId.join('');
    return id;
}

export const create = async (input, user, client) => {
    const { inventoryId, values } = input;
    const inventory = await selectInventoryById(inventoryId, client);
    if (!inventory) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.INVENTORY));
    const data = {
        inventoryId: inventoryId,
        ownerId: user.id,
    }
    const item = await createItem(data, inventory.customIdFormat, values, client);
    return item;
}

export const update = async (itemId, input, expectedVersion, client) => {
    console.log(expectedVersion);
    console.log(input);
    const item = await selectItemById(itemId, client);
    if (!item) throw new NotFound(NOT_FOUND_RECORDS.text(modelName.ITEM));
    if (item.version !== expectedVersion) {
        const e = new Error("VERSION_CONFLICT");
        e.code = "VERSION_CONFLICT";
        e.meta = { currentVersion: item.version, expectedVersion };
        throw e;
    }
    const updatedItem = await updateItem(itemId, input.values, client)
    return updatedItem;
}

export const del = async (itemIds, client) => {
    return deleteItem(itemIds, client);
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