import type { IInventoryData, TInventory } from "../models/Inventory.js";

export enum EnumInventorySortOrder {
  Latest = "latest",
  TopItems = "topItems",
}

export interface IInventoryService {
  getInventories(
    sortOrder?: EnumInventorySortOrder,
    ownerId?: string,
    allowedUserId?: string,
    isPublic?: boolean,
  ): Promise<TInventory[]>;
  getInventoryById(id: number): Promise<TInventory>;
  getInventoryByToken(apiToken: string): Promise<unknown>;
  createInventory(
    userId: string,
    inventoryData: IInventoryData,
  ): Promise<TInventory>;
  updateInventory(
    id: number,
    inventoryData: Partial<IInventoryData>,
  ): Promise<TInventory>;
  deleteInventories(ids: number[]): Promise<{ count: number }>;
  getTokenInventory(id: number): Promise<string>;
  createTokenInventory(inventory: TInventory): Promise<string>;
  searchInventories(query: string): Promise<TInventory[]>;
}
