import type { Prisma, Sequence } from "@prisma/client";
import prisma from "../prisma/prisma.js";
import type { ISequenceModel } from "../types/models/Sequence.js";

export default class SequenceModel implements ISequenceModel {
  async updateOrCreate(
    partGuid: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Sequence> {
    return await (tx ? tx : prisma).sequence.upsert({
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
