import type { Handler } from "express";

export interface IItemValidator {
    getItem(): Handler;
    getItems(): Handler;
    createItem(): Handler;
    updateItem(): Handler;
    deleteItems(): Handler;
}