import { itemSchema } from "#/domain/entities/Item.js";
import { z } from "zod";

export const getItemsSchema = z.object({
  params: z.object({
    inventoryId: itemSchema.shape.inventory.options[0],
  }),
});

export const getItemSchema = z.object({
  params: getItemsSchema.shape.params.extend({
    itemId: itemSchema.shape.id,
  }),
});

export const createItemSchema = z.object({
  params: getItemsSchema.shape.params,
  body: z.object({}),
});

export const updateItemSchema = z.object({
  params: getItemSchema.shape.params,
  body: z.object({}),
});

export const deleteItemsSchema = z.object({
  params: getItemsSchema.shape.params,
  body: z.object({
    itemsId: z.array(itemSchema.shape.id),
  }),
});
export type TGetItemsParams = z.infer<typeof getItemsSchema>["params"];
export type TGetItemParams = z.infer<typeof getItemSchema>["params"];
export type TCreateItemParams = z.infer<typeof createItemSchema>["params"];
export type TCreateItemBody = z.infer<typeof createItemSchema>["body"];
export type TUpdateItemParams = z.infer<typeof updateItemSchema>["params"];
export type TUpdateItemBody = z.infer<typeof updateItemSchema>["body"];
export type TDeleteItemsParams = z.infer<typeof deleteItemsSchema>["params"];
export type TDeleteItemsBody = z.infer<typeof deleteItemsSchema>["body"];
