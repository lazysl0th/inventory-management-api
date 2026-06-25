import type { TSortInventories } from "#/application/inventory/dtos/InventoryDto.js";
import type CustomIdFormatPart from "#/domain/value-objects/CustomIdFormatPart.js";

export default abstract class Model<T, TCreate = T, TUpdate = Partial<T>> {
  abstract getAll(param?: number | TSortInventories | string): Promise<T[]>;
  abstract getById(id: number): Promise<T | null>;
  abstract deleteByIds(ids: number[]): Promise<{ count: number }>;
  abstract updateById(id: number, data: TUpdate, version?: number): Promise<T>;
  abstract create(
    data: TCreate,
    customIdFormatParts?: CustomIdFormatPart[],
  ): Promise<T>;
}
