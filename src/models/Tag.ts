import type { ITagModel, TTag } from "../types/models/Tag.js";
import { TAG_SELECT } from "../constants/selects.js";
import { inject, injectable } from "tsyringe";
import Prisma from "../infrastructure/persistence/prisma/prisma.js";

@injectable()
export default class TagModel implements ITagModel {
  tagSelect = TAG_SELECT;
  constructor(@inject(Prisma) private readonly prisma: Prisma) {}

  async getAll(): Promise<TTag[]> {
    return await this.prisma.client.tag.findMany({
      select: this.tagSelect,
      orderBy: { inventories: { _count: "desc" } },
    });
  }
}
