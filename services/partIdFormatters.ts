import dayjs from 'dayjs';
import type { IPartIdFormatter } from '../types/services/PartIdFormatter.js';
import { EnumCustomIdPartFormatDateTime, EnumCustomIdPartFormatDigit, EnumCustomIdPartFormatHex } from '../types/models/Inventory.js';

export class DateTimeFormatter implements IPartIdFormatter {
    
    readonly formats = Object.values(EnumCustomIdPartFormatDateTime);

    format(value: unknown, format: string): string {
        return dayjs(value as Date).format(format);
    }
}

export class DigitFormatter implements IPartIdFormatter {
    
    readonly formats = Object.values(EnumCustomIdPartFormatDigit);

    format(value: unknown, format: string): string {
        const len = parseInt(format.slice(1), 10);
        const idStr = String(value);
        return idStr.length < len ? idStr.padStart(len, '0') : idStr;
    }
}

export class HexFormatter implements IPartIdFormatter {
    
    readonly formats = Object.values(EnumCustomIdPartFormatHex);

    format(value: unknown): string {
        return BigInt(value as number).toString(16);
    }
}