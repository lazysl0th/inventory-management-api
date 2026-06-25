import type {
  ItemGetPayload,
  LikeGetPayload,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import type Item from "#/domain/entities/Item.js";
import type { TDeleteItemsBodyResponseDto } from "../dtos/ItemDto.js";

export type TItem = ItemGetPayload<true>;

export type TLike = LikeGetPayload<true>;

export interface IItemRepository {
  getAll(inventoryId: string): Promise<Item[]>;
  getById(id: string): Promise<Item | null>;
  save(item: Item): Promise<Item>;
  deleteByIds(ids: string[]): Promise<TDeleteItemsBodyResponseDto>;
  getLike(userId: string, itemId: number): Promise<TLike | null>;
  addLike(userId: string, itemId: number): Promise<TLike>;
  deleteLike(userId: string, itemId: number): Promise<TLike>;
  countLike(itemId: number): Promise<number>;
}
