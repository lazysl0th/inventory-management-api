import type { TransactionClient } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";
import type { ICustomIdFormatPart } from "../models/Inventory.js";

export interface IIdGenerator {
  generateCustomId(
    customIdParts: ICustomIdFormatPart[],
    tx: TransactionClient,
  ): Promise<string>;
}
