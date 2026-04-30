import type { Prisma } from "@prisma/client";
import type { ICustomIdFormatPart } from "./Inventory.js";
import type { Settings } from "../settings.js";

export type TItem = Prisma.ItemGetPayload<{select: Settings['selects']['item']}>;

export type TLike = Prisma.LikeGetPayload<true>;

export type TItemCreateData = Prisma.ItemCreateInput;

export type TItemUpdateData = Prisma.ItemUpdateInput;

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
    create(data: TItemCreateData, customIdFormatParts: ICustomIdFormatPart[]): Promise<TItem>
    updateById(id: number, data: TItemUpdateData): Promise<TItem>;
    deleteByIds(ids: number[]): Promise<{ count: number }>;
    getLike (userId: number, itemId: number): Promise<TLike | null>;
    addLike (userId: number, itemId: number): Promise<TLike>;
    deleteLike (userId: number, itemId: number): Promise<TLike>;
    countLike (itemId: number): Promise<number>
}