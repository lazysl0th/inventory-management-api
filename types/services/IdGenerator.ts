import type { Prisma } from "@prisma/client";
import type { ICustomIdFormatPart } from "../models/Inventory.js";

export interface IIdGenerator {
    generateCustomId (customIdParts: ICustomIdFormatPart[], tx: Prisma.TransactionClient): Promise<string>
}