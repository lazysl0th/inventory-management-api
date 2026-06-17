import type { ITagRepository } from "../../../application/tag/interfaces/ITagRepository.js";
import { inject, injectable } from "tsyringe";
import Prisma from "../prisma/prisma.js";
import type { TTag } from "#/domain/entities/Tag.js";

@injectable()
export default class PrismaTagRepository implements ITagRepository {
  constructor(@inject(Prisma) private readonly prisma: Prisma) {}

  async getAll(): Promise<TTag[]> {
    return await this.prisma.client.tag.findMany({
      include: {
        _count: {
          select: {
            inventories: true,
          },
        },
      },
      orderBy: { inventories: { _count: "desc" } },
    });
  }
}
