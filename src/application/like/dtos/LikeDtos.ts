import { itemSchema } from "#/domain/entities/Item.js";
import { likeSchema } from "#/domain/value-objects/Like.js";
import z from "zod";

export const itemLikeRequestSchema = z.object({
  params: z.object({
    itemId: itemSchema.shape.id,
  }),
});

export const addItemLikeSchema = likeSchema.pick({
  userId: true,
  itemId: true,
});

export const deleteItemLikeSchema = addItemLikeSchema;

//export type TGetItemLikeParams = z.infer<typeof getItemLikeRequestSchema>["params"];

//export type TGetItemLikeDto = z.infer<typeof getItemLikeSchema>;

export type TAddItemLikeParams = z.infer<
  typeof itemLikeRequestSchema
>["params"];

export type TAddItemLikeDto = z.infer<typeof addItemLikeSchema>;

export type TDeleteItemLikeParams = z.infer<
  typeof itemLikeRequestSchema
>["params"];

export type TDeleteItemLikeDto = z.infer<typeof deleteItemLikeSchema>;
