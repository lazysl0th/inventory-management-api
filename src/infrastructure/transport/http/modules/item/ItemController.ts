import type {
  TCreateItemBody,
  TCreateItemParams,
  TDeleteItemsBody,
  TDeleteItemsBodyResponseDto,
  TDeleteItemsParams,
  TGetItemParams,
  TGetItemsParams,
  TUpdateItemBody,
  TUpdateItemParams,
} from "#/application/item/dtos/ItemDto.js";
import type { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";
import HttpStatusCode from "../../constants/httpStatusCode.js";
import GetItems from "#/application/item/use-cases/GetItems.js";
import type Item from "#/domain/entities/Item.js";
import GetItem from "#/application/item/use-cases/GetItem.js";
import UnauthorizedError from "#/domain/errors/UnauthorizedError.js";
import CreateItem from "#/application/item/use-cases/CreateItem.js";
import UpdateItem from "#/application/item/use-cases/UpdateItem.js";
import DeleteItems from "#/application/item/use-cases/DeleteItems.js";

@injectable()
export default class ItemController {
  constructor(
    @inject(GetItems) private readonly getAll: GetItems,
    @inject(GetItem) private readonly getById: GetItem,
    @inject(CreateItem) private readonly create: CreateItem,
    @inject(UpdateItem) private readonly update: UpdateItem,
    @inject(DeleteItems) private readonly deleteByIds: DeleteItems,
  ) {}

  getItems: RequestHandler<TGetItemsParams, Item[]> = async (req, res) => {
    const { inventoryId } = req.params;
    const items = await this.getAll.execute(inventoryId);
    res.status(HttpStatusCode.Ok).json(items);
  };

  getItem: RequestHandler<TGetItemParams, Item> = async (req, res) => {
    const { itemId } = req.params;
    const item = await this.getById.execute(itemId);
    res.status(HttpStatusCode.Ok).json(item);
  };

  createItem: RequestHandler<TCreateItemParams, Item, TCreateItemBody> = async (
    req,
    res,
  ) => {
    /*if (!req.isAuthenticated()) {
            throw new UnauthorizedError();
            }*/
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError();
    }
    const inventoryId = req.params.inventoryId;
    const itemData = req.body;
    const item = await this.create.execute({
      ...itemData,
      owner: userId,
      inventoryId,
    });
    res.status(HttpStatusCode.Ok).json(item);
  };

  updateItem: RequestHandler<TUpdateItemParams, Item, TUpdateItemBody> = async (
    req,
    res,
  ) => {
    const itemId = req.params.itemId;
    const itemData = req.body;
    const item = await this.update.execute({ ...itemData, itemId });
    res.status(HttpStatusCode.Ok).json(item);
  };

  deleteItems: RequestHandler<
    TDeleteItemsParams,
    TDeleteItemsBodyResponseDto,
    TDeleteItemsBody
  > = async (req, res) => {
    const itemsId = req.body.itemsId;
    const result = await this.deleteByIds.execute(itemsId);
    res.status(HttpStatusCode.Ok).json(result);
  };
}
