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
  params: getItemSchema.shape.params,
  body: z.object({
    itemsId: z.array(itemSchema.shape.id),
  }),
});

//type TGetItemsParams = z.infer<typeof getItemsSchema>["params"];
//type TGetItemParams = z.infer<typeof getItemSchema>["params"];
//type TCreateItemParams = z.infer<typeof getItemsSchema>["params"];
