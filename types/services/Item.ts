import type { IItemData, IItemValue, TItem, TItemUpdateData, TLike } from "../models/Item.js";

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
    createItem(userId: number, inventoryId: number, itemValues: IItemValue[]): Promise<TItem>;
    updateItem(id: number, itemData: Partial<IItemData>): Promise<TItem>
    deleteItems(ids: number[]): Promise<{ count: number }>;
    addLike (userId: number, itemId: number): Promise<TLike>
    deleteLike (userId: number, itemId: number): Promise<TLike>
    getLikesCount (itemId: number): Promise<number>;
    getLike (userId: number, itemId: number): Promise<TLike | null>;
}