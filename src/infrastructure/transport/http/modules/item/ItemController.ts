import type {
  TCreateItemBody,
  TCreateItemParams,
  TDeleteItemsBody,
  TDeleteItemsParams,
  TGetItemParams,
  TGetItemsParams,
  TUpdateItemBody,
  TUpdateItemParams,
} from "#/application/item/dtos/ItemDto.js";
import type { RequestHandler } from "express";
import { injectable } from "tsyringe";
import HttpStatusCode from "../../constants/httpStatusCode.js";
import type { TItem } from "../../../../../types/models/Item.js";
import type { IItemService } from "../../../../../types/services/Item.js";
import type Like from "#/domain/entities/Like.js";

@injectable()
export default class ItemController {
  constructor(private readonly ItemService: IItemService) {}
  getItems: RequestHandler<TGetItemsParams, TItem[]> = async (req, res) => {
    const { inventoryId } = req.params;
    const items = await this.ItemService.getItems(Number(inventoryId));
    res.status(HttpStatusCode.Ok).json(items);
  };

  getItem: RequestHandler<TGetItemParams, TItem> = async (req, res) => {
    const { itemId } = req.params;
    const item = await this.ItemService.getItem(Number(itemId));
    res.status(HttpStatusCode.Ok).json(item);
  };

  createItem: RequestHandler<TCreateItemParams, TItem, TCreateItemBody> =
    async (req, res) => {
      /*if (!req.isAuthenticated()) {
            throw new UnauthorizedError();
            }*/
      const userId = req.user?.id;
      const inventoryId = req.params.inventoryId;
      const itemData = req.body.values;
      const item = await this.ItemService.createItem(
        userId || "019efd6f-7555-7053-b1ca-3381791381cd",
        Number(inventoryId),
        itemData,
      );
      res.status(HttpStatusCode.Ok).json(item);
    };

  updateItem: RequestHandler<TUpdateItemParams, TItem, TUpdateItemBody> =
    async (req, res) => {
      const itemId = req.params.itemId;
      const itemData = req.body;
      const item = await this.ItemService.updateItem(Number(itemId), itemData);
      res.status(HttpStatusCode.Ok).json(item);
    };

  deleteItems: RequestHandler<
    TDeleteItemsParams,
    { count: number },
    TDeleteItemsBody
  > = async (req, res) => {
    const itemsId = req.body.itemsId;
    const result = await this.ItemService.deleteItems(itemsId);
    res.status(HttpStatusCode.Ok).json(result);
  };
  addLike: RequestHandler<TGetItemParams, Like> = async (req, res) => {
    /*if (!req.isAuthenticated()) {
            throw new UnauthorizedError();
            }*/
    const userId = req.user?.id;
    const itemId = req.params.itemId;
    const result = await this.ItemService.addLike(userId, itemId);
    res.status(HttpStatusCode.Ok).json(result);
  };

  deleteLike: RequestHandler<TGetItemParams> = async (req, res) => {
    /*if (!req.isAuthenticated()) {
            throw new UnauthorizedError();
            }*/
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const result = await this.ItemService.deleteLike(userId, Number(itemId));
    res.status(HttpStatusCode.Ok).json(result);
  };

  getLikesCount: RequestHandler<TGetItemParams, { count: number }> = async (
    req,
    res,
  ) => {
    const itemId = req.params.itemId;
    const result = await this.ItemService.getLikesCount(Number(itemId));
    res.status(HttpStatusCode.Ok).json({ count: result });
  };

  getLike: RequestHandler<TGetItemParams> = async (req, res) => {
    /*if (!req.isAuthenticated()) {
            throw new UnauthorizedError();
            }*/
    const userId = req.user?.id;
    const itemId = req.params.itemId;
    const result = await this.ItemService.getLike(userId, Number(itemId));
    res.status(HttpStatusCode.Ok).json({ count: result });
  };
}
