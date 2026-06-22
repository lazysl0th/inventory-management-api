import type { IItemData, IItemValue, TItem, TLike } from "../models/Item.js";

export interface IPartIdData {
  partId: number | string | bigint;
  sequence?: ISequenceData;
}

export interface ISequenceData {
  partGuid: string;
  from: number;
  to: number;
}

export interface ICustomIdData {
  id: string;
  sequences: ISequenceData[];
}

export interface IItemService {
  getItems(inventoryId: number): Promise<TItem[]>;
  getItem(id: number): Promise<TItem>;
  createItem(
    userId: string,
    inventoryId: number,
    itemValues: IItemValue[],
  ): Promise<TItem>;
  updateItem(id: number, itemData: Partial<IItemData>): Promise<TItem>;
  deleteItems(ids: number[]): Promise<{ count: number }>;
  addLike(userId: string, itemId: number): Promise<TLike>;
  deleteLike(userId: string, itemId: number): Promise<TLike>;
  getLikesCount(itemId: number): Promise<number>;
  getLike(userId: string, itemId: number): Promise<TLike | null>;
}
