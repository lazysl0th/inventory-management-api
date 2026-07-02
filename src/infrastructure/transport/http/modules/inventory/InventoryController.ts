import { inject, injectable } from "tsyringe";
import type { RequestHandler } from "express";
import HttpStatusCode from "../../constants/httpStatusCode.js";
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
import type {
  TCreateInventoryBodyDto,
  TDeleteInventoriesBodyRequestDto,
  TDeleteInventoriesBodyResponseDto,
  TGetInventoriesQueryDto,
  TGetInventoryByTokenParamsDto,
  TGetInventoryParamsDto,
  TGetInventoryTokenBodyResponseDto,
  TSearchInventoriesQueryDto,
  TUpdateInventoryBodyDto,
  TUpdateInventoryParamsDto,
} from "#/application/inventory/dtos/InventoryDto.js";
import type Inventory from "#/domain/entities/Inventory.js";

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
    Inventory[],
    never,
    TGetInventoriesQueryDto
  > = async (req, res) => {
    const { sort, ownerId } = req.query;
    const { allowedUserId, isPublic } = req.query;
    const inventories = await this.getByConditions.execute({
      sort,
      ownerId,
      allowedUserId,
      isPublic,
    });
    res.status(HttpStatusCode.Ok).json(inventories);
  };

  searchInventories: RequestHandler<
    never,
    Inventory[],
    never,
    TSearchInventoriesQueryDto
  > = async (req, res) => {
    const { searchQuery } = req.query;
    const searchResult = await this.fullTextSearch.execute({ searchQuery });
    res.status(HttpStatusCode.Ok).json(searchResult);
  };

  getInventoryById: RequestHandler<TGetInventoryParamsDto, Inventory> = async (
    req,
    res,
  ) => {
    const { inventoryId } = req.params;
    const inventory = await this.getById.execute(inventoryId);
    res.status(HttpStatusCode.Ok).json(inventory);
  };

  getInventoryByToken: RequestHandler<
    TGetInventoryByTokenParamsDto,
    Inventory
  > = async (req, res) => {
    const { token } = req.params;
    await this.getByToken.execute(token);
    res.status(HttpStatusCode.Ok).json();
  };

  getInventoryCategories: RequestHandler<never, Category[]> = async (
    _,
    res,
  ) => {
    const categories = Object.values(Category);
    res.status(HttpStatusCode.Ok).json(categories);
  };

  createInventory: RequestHandler<never, Inventory, TCreateInventoryBodyDto> =
    async (req, res) => {
      if (!req.isAuthenticated()) {
        throw new UnauthorizedError();
      }
      const inventoryData = req.body;
      const userId = req.user?.id;
      const inventory = await this.create.execute({
        ...inventoryData,
        owner: userId,
      });
      res.status(HttpStatusCode.Ok).json(inventory);
    };

  updateInventory: RequestHandler<
    TUpdateInventoryParamsDto,
    Inventory,
    TUpdateInventoryBodyDto
  > = async (req, res) => {
    const { inventoryId } = req.params;
    const inventoryData = req.body;
    const inventory = await this.update.execute({
      id: inventoryId,
      ...inventoryData,
    });
    res.status(HttpStatusCode.Ok).json(inventory);
  };

  getInventoryToken: RequestHandler<
    TGetInventoryParamsDto,
    TGetInventoryTokenBodyResponseDto
  > = async (req, res) => {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedError();
    }
    const { inventoryId } = req.params;
    const inventoryToken = await this.getToken.execute(inventoryId);
    res.status(HttpStatusCode.Ok).json({ inventoryToken });
  };

  deleteInventories: RequestHandler<
    object,
    TDeleteInventoriesBodyResponseDto,
    TDeleteInventoriesBodyRequestDto
  > = async (req, res) => {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedError();
    }
    const { inventoriesIds } = req.body;
    const result = await this.deleteInventoriesById.execute(inventoriesIds);
    res.status(HttpStatusCode.Ok).json(result);
  };
}
