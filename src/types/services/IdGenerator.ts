import type CustomIdFormatPart from "#/domain/value-objects/CustomIdFormatPart.js";
import type { TransactionClient } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";

export interface IIdGenerator {
  generateCustomId(
    customIdParts: CustomIdFormatPart[],
    tx: TransactionClient,
  ): Promise<string>;
}
