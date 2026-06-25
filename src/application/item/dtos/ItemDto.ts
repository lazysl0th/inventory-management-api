import { inventorySchema } from "#/domain/entities/Inventory.js";
import { createItemSchema, itemSchema } from "#/domain/entities/Item.js";
import { z } from "zod";

export const getItemsSchema = z.object({
  params: z.object({
    inventoryId: inventorySchema.shape.id,
  }),
});

export const getItemSchema = z.object({
  params: z.object({
    itemId: itemSchema.shape.id,
  }),
});

export const createItemRequestSchema = z.object({
  params: getItemsSchema.shape.params,
  body: createItemSchema.pick({ values: true }),
});

export const updateItemSchema = z.object({
  params: getItemSchema.shape.params,
  body: createItemRequestSchema.shape.body.extend({
    customId: itemSchema.shape.customId,
    owner: itemSchema.shape.owner.options[0],
  }),
});

export const deleteItemsSchema = z.object({
  params: getItemSchema.shape.params,
  body: z.object({
    itemsId: z.array(itemSchema.shape.id),
  }),
});

export const deleteItemsBodyResponseSchema = z.object({
  body: z.object({
    count: z.number().positive().int(),
  }),
});

export type TGetItemsParams = z.infer<typeof getItemsSchema>["params"];
export type TGetItemParams = z.infer<typeof getItemSchema>["params"];
export type TCreateItemParams = z.infer<
  typeof createItemRequestSchema
>["params"];
export type TCreateItemBody = z.infer<typeof createItemRequestSchema>["body"];

export type TCreateItemDto = z.infer<typeof createItemSchema>;

export type TUpdateItemParams = z.infer<typeof updateItemSchema>["params"];
export type TUpdateItemBody = z.infer<typeof updateItemSchema>["body"];

export type TUpdateItemDto = Required<TUpdateItemParams & TUpdateItemBody>;

export type TDeleteItemsParams = z.infer<typeof deleteItemsSchema>["params"];
export type TDeleteItemsBody = z.infer<typeof deleteItemsSchema>["body"];

export type TDeleteItemsBodyResponseDto = z.infer<
  typeof deleteItemsBodyResponseSchema
>["body"];
