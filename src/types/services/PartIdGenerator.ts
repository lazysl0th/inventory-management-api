import type { TransactionClient } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";

export interface IPartIdGenerator {
  generate(
    param?: string,
    tx?: TransactionClient,
  ): number | bigint | string | Promise<number> | Promise<Date>;
}
