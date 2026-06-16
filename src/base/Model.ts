import type { ICustomIdFormatPart } from "../types/models/Inventory.js";
import type { EnumInventorySortOrder } from "../types/services/Inventory.js";

export default abstract class Model<T, TCreate = T, TUpdate = Partial<T>> {
  abstract getAll(
    param?: number | EnumInventorySortOrder | string,
  ): Promise<T[]>;
  abstract getById(id: number): Promise<T | null>;
  abstract deleteByIds(ids: number[]): Promise<{ count: number }>;
  abstract updateById(id: number, data: TUpdate, version?: number): Promise<T>;
  abstract create(
    data: TCreate,
    customIdFormatParts?: ICustomIdFormatPart[],
  ): Promise<T>;
}
