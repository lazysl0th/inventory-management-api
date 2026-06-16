import { Controller } from "../base/Controller.js";
import type { Handler } from "express";
import type {
  IBodyItemsIds,
  IItemController,
  IParamItemId,
} from "../types/controllers/Item.js";
import type { IItemService } from "../types/services/Item.js";
import type { IItemData, TItem, TLike } from "../types/models/Item.js";
import type { IParamInventoryId } from "../types/controllers/Inventory.js";

export default class ItemController
  extends Controller
  implements IItemController
{
  constructor(private readonly ItemService: IItemService) {
    super();
  }

  getItems: Handler = this.handle<IParamInventoryId>(async (req, res) => {
    const inventoryId = req.params.inventoryId;
    const items = await this.ItemService.getItems(inventoryId);
    this.ok<TItem[]>(res, items);
  });

  getItem: Handler = this.handle<IParamItemId>(async (req, res) => {
    const itemId = req.params.itemId;
    const inventory = await this.ItemService.getItem(itemId);
    this.ok<TItem>(res, inventory);
  });

  createItem: Handler = this.handle<IParamInventoryId, IItemData>(
    async (req, res) => {
      const userId = req.user.id;
      const inventoryId = req.params.inventoryId;
      const itemData = req.body.values;
      const item = await this.ItemService.createItem(
        userId,
        inventoryId,
        itemData,
      );
      this.ok<TItem>(res, item);
    },
  );

  updateItem: Handler = this.handle<IParamItemId, IItemData>(
    async (req, res) => {
      const itemId = req.params.itemId;
      const itemData = req.body;
      const item = await this.ItemService.updateItem(itemId, itemData);
      this.ok<TItem>(res, item);
    },
  );

  deleteItems: Handler = this.handle<object, IBodyItemsIds>(
    async (req, res) => {
      const itemIds = req.body.itemIds;
      const result = await this.ItemService.deleteItems(itemIds);
      this.ok<{ count: number }>(res, result);
    },
  );

  addLike: Handler = this.handle<IParamItemId>(async (req, res) => {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const result = await this.ItemService.addLike(userId, itemId);
    this.ok<TLike>(res, result);
  });

  deleteLike: Handler = this.handle<IParamItemId>(async (req, res) => {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const result = await this.ItemService.deleteLike(userId, itemId);
    this.ok<TLike>(res, result);
  });

  getLikesCount: Handler = this.handle<IParamItemId>(async (req, res) => {
    const itemId = req.params.itemId;
    const result = await this.ItemService.getLikesCount(itemId);
    this.ok<{ count: number }>(res, { count: result });
  });

  getLike: Handler = this.handle<IParamItemId>(async (req, res) => {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const result = await this.ItemService.getLike(userId, itemId);
    this.ok<TLike | null>(res, result);
  });
}
