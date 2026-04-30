import type { Prisma } from "@prisma/client";
import type { ICustomIdPart } from "../models/Inventory.js";

export interface IIdGenerator {
    generateCustomId (customIdParts: ICustomIdPart[], tx: Prisma.TransactionClient): Promise<string>
}