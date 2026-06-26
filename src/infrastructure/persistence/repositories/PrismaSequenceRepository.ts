import { inject, injectable } from "tsyringe";
import Prisma from "../prisma/prisma.js";
import type { ISequenceRepository } from "#/application/services/CustomId/interfaces/ISequenceRepository.js";

@injectable()
export default class PrismaSequenceRepository implements ISequenceRepository {
  constructor(@inject(Prisma) private readonly prisma: Prisma) {}
  async getCurrentValue(partGuid: string): Promise<number> {
    const sequence = await this.prisma.client.sequence.upsert({
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
      select: {
        currentValue: true,
      },
    });
    return sequence.currentValue;
  }
}
