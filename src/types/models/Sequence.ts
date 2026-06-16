import type { Prisma, Sequence } from "@prisma/client";

export interface ISequenceModel {
  updateOrCreate(
    partGuid: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Sequence>;
}
