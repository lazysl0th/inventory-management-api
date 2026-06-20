import type Tag from "#/domain/entities/Tag.js";
import type { TagGetPayload } from "#/infrastructure/persistence/prisma/generated/models.js";

export type TTag = TagGetPayload<{
  include: {
    _count: {
      select: {
        inventories: true;
      };
    };
  };
}>;

export interface ITagRepository {
  getAll(): Promise<Tag[]>;
}
