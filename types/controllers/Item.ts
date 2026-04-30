import type { Handler } from "express";

export interface IParamItemId { 
    itemId: number;
};

export interface IBodyCreateItem {
    token?: string;
}

export interface IBodyItemsIds {
    itemIds: number[];
}

export interface IItemController {
    getItems: Handler;
    getItem: Handler;
    createItem: Handler;
    updateItem: Handler;
    deleteItems: Handler;
    addLike: Handler;
    deleteLike: Handler;
    getLikesCount: Handler;
    getLike: Handler
}