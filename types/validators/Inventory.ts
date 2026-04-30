import type { Handler } from "express";

export interface IInventoryValidator {
    getInventory(): Handler;
    getInventoryByToken(): Handler;
    getInventories(): Handler;
    updateInventory(): Handler;
    searchInventories(): Handler;
    deleteInventories(): Handler;
}