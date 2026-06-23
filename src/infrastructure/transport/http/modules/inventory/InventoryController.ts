import { inject, injectable } from "tsyringe";
import type { RequestHandler } from "express";
import HttpStatusCode from "../../constants/httpStatusCode.js";
import type {
  IBodyInventoryIds,
  IQueryInventorySort,
  TParamInventoryId,
  TParamInventoryToken,
  TQueryInventorySearch,
} from "../../../../../types/controllers/Inventory.js";
import type {
  IInventoryData,
  TInventory,
  TUpdateInventoryData,
} from "../../../../../types/models/Inventory.js";
import UnauthorizedError from "#/domain/errors/UnauthorizedError.js";
import GetInventories from "#/application/inventory/use-cases/GetInventories.js";
import SearchInventories from "#/application/inventory/use-cases/SearchInventories.js";
import GetInventoryById from "#/application/inventory/use-cases/GetInventoryById.js";
import GetInventoryByToken from "#/application/inventory/use-cases/GetInventoryByToken.js";
import CreateInventory from "#/application/inventory/use-cases/CreateInventory.js";
import UpdateInventory from "#/application/inventory/use-cases/UpdateInventory.js";
import GetInventoryToken from "#/application/inventory/use-cases/GetInventoryToken.js";
import DeleteInventories from "#/application/inventory/use-cases/DeleteInventories.js";
import { Category } from "#/infrastructure/persistence/prisma/generated/enums.js";

@injectable()
export default class InventoryController {
  constructor(
    @inject(GetInventories)
    private readonly getByConditions: GetInventories,
    @inject(SearchInventories)
    private readonly fullTextSearch: SearchInventories,
    @inject(GetInventoryById)
    private readonly getById: GetInventoryById,
    @inject(GetInventoryByToken)
    private readonly getByToken: GetInventoryByToken,
    @inject(CreateInventory)
    private readonly create: CreateInventory,
    @inject(UpdateInventory)
    private readonly update: UpdateInventory,
    @inject(GetInventoryToken)
    private readonly getToken: GetInventoryToken,
    @inject(DeleteInventories)
    private readonly deleteInventoriesById: DeleteInventories,
  ) {}
  getInventories: RequestHandler<
    never,
    TInventory[],
    never,
    IQueryInventorySort
  > = async (req, res) => {
    const sortOrder = req.query.sort;
    const ownerId = req.query.ownerId;
    const { allowedUserId, isPublic } = req.query;
    const inventories = await this.getByConditions.execute(
      sortOrder,
      ownerId,
      allowedUserId,
      isPublic,
    );
    res.status(HttpStatusCode.Ok).json(inventories);
  };

  searchInventories: RequestHandler<
    never,
    TInventory[],
    never,
    TQueryInventorySearch
  > = async (req, res) => {
    const { query } = req.query;
    const result = await this.fullTextSearch.execute(query);
    res.status(HttpStatusCode.Ok).json(result);
  };

  getInventoryById: RequestHandler<TParamInventoryId, TInventory> = async (
    req,
    res,
  ) => {
    const { inventoryId } = req.params;
    const inventory = await this.getById.execute(Number(inventoryId));
    res.status(HttpStatusCode.Ok).json(inventory);
  };

  getInventoryByToken: RequestHandler<TParamInventoryToken, TInventory> =
    async (req, res) => {
      const token = req.params.token;
      await this.getByToken.execute(token);
      res.status(HttpStatusCode.Ok).json();
    };

  getInventoryCategories: RequestHandler<never, Category[]> = async (
    req,
    res,
  ) => {
    const categories = Object.values(Category);
    res.status(HttpStatusCode.Ok).json(categories);
  };

  createInventory: RequestHandler<never, TInventory, IInventoryData> = async (
    req,
    res,
  ) => {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedError();
    }
    const inventoryData = req.body;
    const userId = req.user.id;
    const inventory = await this.create.execute(userId, inventoryData);
    res.status(HttpStatusCode.Ok).json(inventory);
  };

  updateInventory: RequestHandler<
    TParamInventoryId,
    TInventory,
    TUpdateInventoryData
  > = async (req, res) => {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedError();
    }
    const inventoryId = req.params.inventoryId;
    const inventoryData = req.body;
    const inventory = await this.update.execute(
      Number(inventoryId),
      inventoryData,
    );
    res.status(HttpStatusCode.Ok).json(inventory);
  };

  getInventoryToken: RequestHandler<TParamInventoryId, string> = async (
    req,
    res,
  ) => {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedError();
    }
    const inventoryId = req.params.inventoryId;
    const inventoryToken = await this.getToken.execute(Number(inventoryId));
    res.status(HttpStatusCode.Ok).json(inventoryToken);
  };

  deleteInventories: RequestHandler<
    object,
    { count: number },
    IBodyInventoryIds
  > = async (req, res) => {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedError();
    }
    const inventoryIds = req.body.inventoryIds;
    const result = await this.deleteInventoriesById.execute(inventoryIds);
    res.status(HttpStatusCode.Ok).json(result);
  };
}
