import crypto from 'crypto';
import dayjs from "dayjs";
import { updateSequencePart } from './models/inventory.js'

export const checkCustomId = (summary, customId) => {
    const mask = buildMaskFromSummary(summary);
    return mask.test(customId);
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

const formatId = (id, format) => {
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
    const start = Number(currentPart.value) || 1;
    const prev  = Number(currentPart.currentSequence);
    let next;
    if (isNaN(prev)) next = start;
    else if (start > prev) next = start;
    else next = prev + 1;
    const updatedParts = customIdFormat.parts.map((part) => part.guid === currentPart.guid ? { ...part, currentSequence: next } : part);
    const updatedFormat = { ...customIdFormat, parts: updatedParts };
    await updateSequencePart(inventoryId, updatedFormat, client);
    return next;
}

const buildMaskFromSummary = (summary) => {
    const chars = Array.from(summary);
    const pattern = chars.map((ch) => {
        if (/\p{Number}/u.test(ch)) return "\\p{Number}";
        if (/\p{Letter}/u.test(ch)) return "\\p{Letter}";
        if (/\p{Emoji}/u.test(ch)) return "\\p{Emoji}";
        return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }).join("");
    return new RegExp(`^${pattern}$`, "u");
};

export const normalizeValue = (rawValue, fieldType) => {
    if (rawValue === undefined || rawValue === null) return '';
    switch (fieldType) {
        case 'BOOLEAN':
            return rawValue ? "true" : "false";
        case 'NUMBER':
            return String(Number(rawValue));
        case 'FILE':
        case 'TEXT':
        case 'LONGTEXT':
        default:
            return String(rawValue);
    }
};

export const parseValue = (storedValue, fieldType) => {
    if (storedValue === null || storedValue === undefined) return null;
    switch (fieldType) {
        case "BOOLEAN":
            return storedValue === "true";
        case "NUMBER":
        const num = Number(storedValue);
        return isNaN(num) ? null : num;
        case "FILE":
        case "TEXT":
        case "LONGTEXT":
        default:
            return storedValue;
    }
};