import type { RequestHandler } from "express";
import type { InjectionToken } from "tsyringe";

import validate from "../../middlewares/validation.js";
import {
  createItemSchema,
  deleteItemsSchema,
  getItemSchema,
  getItemsSchema,
  updateItemSchema,
} from "#/application/item/dtos/ItemDto.js";

export type TItemRoutes =
  | "getItems"
  | "getItem"
  | "createItem"
  | "updateItem"
  | "deleteItems";

export type IItemValidations = Record<TItemRoutes, RequestHandler>;

const itemValidations: IItemValidations = {
  getItems: validate(getItemsSchema),
  getItem: validate(getItemSchema),
  createItem: validate(createItemSchema),
  updateItem: validate(updateItemSchema),
  deleteItems: validate(deleteItemsSchema),
};

export const ITEM_VALIDATIONS_TOKEN: InjectionToken<IItemValidations> =
  Symbol("ITEM_VALIDATIONS");

export default itemValidations;
