import { inventorySchema } from "#/domain/entities/Inventory.js";
import z from "zod";

export const getInventoriesSchema = z.object({
  query: z.object({
    sort: z.enum(["latest", "topItems"]).optional(),
    ownerId: z.uuid().optional(),
    allowedUserId: z.uuid().optional(),
    isPublic: z
      .stringbool({
        truthy: ["true"],
        falsy: ["false"],
      })
      .optional(),
  }),
});

export const searchInventoriesSchema = z.object({
  query: z.object({
    searchQuery: z.string().transform((val) => val.match(/\S+/g) || []),
  }),
});

export const getInventorySchema = z.object({
  params: z.object({
    inventoryId: inventorySchema.shape.id,
  }),
});

export const getInventoryByTokenSchema = z.object({
  params: z.object({
    token: inventorySchema.shape.token.unwrap(),
  }),
});

export const createInventoryBodySchema = z.object({
  body: inventorySchema.omit({
    id: true,
    owner: true,
    createdAt: true,
    updatedAt: true,
    version: true,
  }),
});

export const updateInventorySchema = z.object({
  params: getInventorySchema.shape.params,
  body: createInventoryBodySchema.shape.body.extend({
    token: z.jwt().nullable(),
    owner: z.uuid(),
  }),
});

export const getInventoryTokenBodyResponseSchema = z.object({
  body: z.object({
    inventoryToken: inventorySchema.shape.token,
  }),
});

export const deleteInventoriesBodyRequestSchema = z.object({
  body: z.object({
    inventoriesIds: z.array(inventorySchema.shape.id),
  }),
});

export const deleteInventoriesBodyResponseSchema = z.object({
  body: z.object({
    count: z.number().positive().int(),
  }),
});

export type TGetInventoriesQueryDto = z.infer<
  typeof getInventoriesSchema
>["query"];

export type TSortInventories = z.infer<
  typeof getInventoriesSchema
>["query"]["sort"];

export type TSearchInventoriesQueryDto = z.infer<
  typeof searchInventoriesSchema
>["query"];

export type TGetInventoryParamsDto = z.infer<
  typeof getInventorySchema
>["params"];

export type TGetInventoryByTokenParamsDto = z.infer<
  typeof getInventoryByTokenSchema
>["params"];

export type TCreateInventoryBodyDto = z.infer<
  typeof createInventoryBodySchema
>["body"];

export type TUpdateInventoryParamsDto = z.infer<
  typeof updateInventorySchema
>["params"];

export type TUpdateInventoryBodyDto = z.infer<
  typeof updateInventorySchema
>["body"];

export type TCreateInventoryDto = TUpdateInventoryBodyDto;

export type TUpdateInventoryDto = Required<
  TUpdateInventoryParamsDto & TUpdateInventoryBodyDto
>;

export type TGetInventoryTokenBodyResponseDto = z.infer<
  typeof getInventoryTokenBodyResponseSchema
>["body"];

export type TDeleteInventoriesBodyRequestDto = z.infer<
  typeof deleteInventoriesBodyRequestSchema
>["body"];

export type TDeleteInventoriesBodyResponseDto = z.infer<
  typeof deleteInventoriesBodyResponseSchema
>["body"];
