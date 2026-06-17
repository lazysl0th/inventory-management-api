import type { ICustomIdFormatPart } from "./Inventory.js";
import type { Settings } from "../settings.js";
import type {
  ItemCreateInput,
  ItemGetPayload,
  ItemUpdateInput,
  LikeGetPayload,
} from "#/infrastructure/persistence/prisma/generated/models.js";

export type TItem = ItemGetPayload<{
  select: Settings["selects"]["item"];
}>;

export type TLike = LikeGetPayload<true>;

export type TItemCreateData = ItemCreateInput;

export type TItemUpdateData = ItemUpdateInput;

export interface IItemData {
  customId: string;
  values: IItemValue[];
}

export interface IItemValue {
  id: number;
  value: string;
  fieldId: number;
}

export interface IItemModel {
  getAll(inventoryId: number): Promise<TItem[]>;
  getById(id: number): Promise<TItem | null>;
  create(
    data: TItemCreateData,
    customIdFormatParts: ICustomIdFormatPart[],
  ): Promise<TItem>;
  updateById(id: number, data: TItemUpdateData): Promise<TItem>;
  deleteByIds(ids: number[]): Promise<{ count: number }>;
  getLike(userId: number, itemId: number): Promise<TLike | null>;
  addLike(userId: number, itemId: number): Promise<TLike>;
  deleteLike(userId: number, itemId: number): Promise<TLike>;
  countLike(itemId: number): Promise<number>;
}
