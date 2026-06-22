import type Tag from "#/domain/entities/Tag.js";

export interface ITagRepository {
  getAll(): Promise<Tag[]>;
}
