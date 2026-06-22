import type { Handler } from "express";
import type { EnumInventorySortOrder } from "../services/Inventory.js";

export interface IParamInventoryId {
  inventoryId: number;
}

export interface IBodyInventoryIds {
  inventoryIds: number[];
}

export interface IParamInventoryToken {
  token: string;
}

export interface IQueryInventorySort {
  sort?: EnumInventorySortOrder;
  ownerId?: string;
  allowedUserId?: string;
  isPublic?: boolean;
}

export interface IQueryInventorySearch {
  query: string;
}

export interface IInventoryController {
  getInventoryById: Handler;
  getInventoryByToken: Handler;
  getInventories: Handler;
  createInventory: Handler;
  updateInventory: Handler;
  deleteInventories: Handler;
  getTokenInventory: Handler;
  searchInventories: Handler;
  getInventoryCategories: Handler;
}
