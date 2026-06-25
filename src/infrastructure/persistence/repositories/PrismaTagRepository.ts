import { inject, injectable } from "tsyringe";
import Prisma from "../prisma/prisma.js";
import type { ITagRepository } from "#/application/tag/interfaces/ITagRepository.js";
import Tag from "#/domain/value-objects/Tag.js";
import type { TagGetPayload } from "../prisma/generated/models.js";

export type TTag = TagGetPayload<{
  include: {
    _count: {
      select: {
        inventories: true;
      };
    };
  };
}>;

@injectable()
export default class PrismaTagRepository implements ITagRepository {
  constructor(@inject(Prisma) private readonly prisma: Prisma) {}

  private createTag(tagData: TTag): Tag {
    return Tag.restore({
      ...tagData,
      count: tagData._count.inventories,
    });
  }

  async getAll(): Promise<Tag[]> {
    const tagsData = await this.prisma.client.tag.findMany({
      include: {
        _count: {
          select: {
            inventories: true,
          },
        },
      },
      orderBy: { inventories: { _count: "desc" } },
    });
    return tagsData.map(this.createTag);
  }
}
