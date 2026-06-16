import { Controller } from "../base/Controller.js";
import type { Handler } from "express";
import type {
  IBodyInventoryIds,
  IInventoryController,
  IParamInventoryId,
  IParamInventoryToken,
  IQueryInventorySearch,
  IQueryInventorySort,
} from "../types/controllers/Inventory.js";
import type { IInventoryService } from "../types/services/Inventory.js";
import type { IInventoryData, TInventory } from "../types/models/Inventory.js";
import { Category } from "@prisma/client";

export default class InventoryController
  extends Controller
  implements IInventoryController
{
  constructor(private readonly InventoryService: IInventoryService) {
    super();
  }

  getTokenInventory: Handler = this.handle<IParamInventoryId>(
    async (req, res) => {
      const inventoryId = req.params.inventoryId;
      const inventoryToken =
        await this.InventoryService.getTokenInventory(inventoryId);
      this.ok(res, inventoryToken);
    },
  );

  getInventoryByToken: Handler = this.handle<IParamInventoryToken>(
    async (req, res) => {
      const token = req.params.token;
      const inventoryInfo =
        await this.InventoryService.getInventoryByToken(token);
      this.ok(res, inventoryInfo);
    },
  );

  getInventories: Handler = this.handle<object, object, IQueryInventorySort>(
    async (req, res) => {
      const sortOrder = req.query.sort;
      const ownerId = req.query.ownerId;
      const { allowedUserId, isPublic } = req.query;
      const inventories = await this.InventoryService.getInventories(
        sortOrder,
        ownerId,
        allowedUserId,
        isPublic,
      );
      this.ok<TInventory[]>(res, inventories);
    },
  );

  getInventoryById: Handler = this.handle<IParamInventoryId>(
    async (req, res) => {
      const inventoryId = req.params.inventoryId;
      const inventory =
        await this.InventoryService.getInventoryById(inventoryId);
      this.ok<TInventory>(res, inventory);
    },
  );

  createInventory: Handler = this.handle<object, IInventoryData>(
    async (req, res) => {
      const inventoryData = req.body;
      const userId = req.user.id;
      const inventory = await this.InventoryService.createInventory(
        userId,
        inventoryData,
      );
      this.ok<TInventory>(res, inventory);
    },
  );

  updateInventory: Handler = this.handle<
    IParamInventoryId,
    Partial<IInventoryData>
  >(async (req, res) => {
    const inventoryId = req.params.inventoryId;
    const inventoryData = req.body;
    const inventory = await this.InventoryService.updateInventory(
      inventoryId,
      inventoryData,
    );
    this.ok<TInventory>(res, inventory);
  });

  deleteInventories: Handler = this.handle<object, IBodyInventoryIds>(
    async (req, res) => {
      const inventoryIds = req.body.inventoryIds;
      const result =
        await this.InventoryService.deleteInventories(inventoryIds);
      this.ok<{ count: number }>(res, result);
    },
  );

  searchInventories: Handler = this.handle<
    object,
    object,
    IQueryInventorySearch
  >(async (req, res) => {
    const query = req.query.query;
    const result = await this.InventoryService.searchInventories(query);
    this.ok<TInventory[]>(res, result);
  });

  getInventoryCategories: Handler = this.handle(async (req, res) => {
    const categories = Object.values(Category);
    this.ok<Category[]>(res, categories);
  });
}
