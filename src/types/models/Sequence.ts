import type { Sequence } from "#/infrastructure/persistence/prisma/generated/client.js";
import type { TransactionClient } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";

export interface ISequenceModel {
  updateOrCreate(partGuid: string, tx?: TransactionClient): Promise<Sequence>;
}
