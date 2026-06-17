import type { Sequence } from "#/infrastructure/persistence/prisma/generated/client.js";
import type { TransactionClient } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";
import Prisma from "../infrastructure/persistence/prisma/prisma.js";
import type { ISequenceModel } from "../types/models/Sequence.js";
import { container } from "tsyringe";

export default class SequenceModel implements ISequenceModel {
  prisma: Prisma;
  constructor(/*@inject(Prisma) private readonly prisma: Prisma*/) {
    this.prisma = container.resolve(Prisma);
  }
  async updateOrCreate(
    partGuid: string,
    tx?: TransactionClient,
  ): Promise<Sequence> {
    return await (tx ? tx : this.prisma.client).sequence.upsert({
      where: { partGuid },
      update: {
        currentValue: {
          increment: 1,
        },
      },
      create: {
        partGuid: partGuid,
        currentValue: 1,
      },
    });
  }
}
