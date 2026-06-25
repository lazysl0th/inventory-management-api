import type Tag from "#/domain/value-objects/Tag.js";

export interface ITagRepository {
  getAll(): Promise<Tag[]>;
}
