import type { TTag } from "#/domain/entities/Tag.js";

export interface ITagRepository {
  getAll(): Promise<TTag[]>;
}
