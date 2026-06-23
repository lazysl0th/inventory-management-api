import type { RequestHandler } from "express";
import type { InjectionToken } from "tsyringe";

import validate from "../../middlewares/validation.js";
import {
  deleteInventoriesSchema,
  getInventoriesSchema,
  getInventoryByTokenSchema,
  getInventorySchema,
  searchInventoriesSchema,
  updateInventorySchema,
} from "#/application/inventory/dtos/InventoryDto.js";

export type TInventoryRoutes =
  | "getInventories"
  | "searchInventories"
  | "getInventory"
  | "getInventoryByToken"
  | "updateInventory"
  | "deleteInventories";

export type IInventoryValidations = Record<TInventoryRoutes, RequestHandler>;

const inventoryValidations: IInventoryValidations = {
  getInventories: validate(getInventoriesSchema),
  searchInventories: validate(searchInventoriesSchema),
  getInventory: validate(getInventorySchema),
  getInventoryByToken: validate(getInventoryByTokenSchema),
  updateInventory: validate(updateInventorySchema),
  deleteInventories: validate(deleteInventoriesSchema),
};

export const INVENTORY_VALIDATIONS_TOKEN: InjectionToken<IInventoryValidations> =
  Symbol("INVENTORY_VALIDATIONS");

export default inventoryValidations;
