import z from "zod";

export const getInventoriesSchema = z.object({
  query: z.object({
    sort: z.enum(["latest", "topItems"]).optional(),
    ownerId: z.uuid().optional(),
    allowedUserId: z.uuid().optional(),
    isPublic: z.boolean().optional(),
  }),
});

export const searchInventoriesSchema = z.object({
  query: z.object({
    searchQuery: z
      .string()
      .trim()
      .min(1, "Search query must be at least 1 characters long"),
  }),
});

export const getInventorySchema = z.object({
  params: z.object({
    inventoryId: z.uuid(),
  }),
});

export const getInventoryByTokenSchema = z.object({
  params: z.object({
    token: z.jwt(),
  }),
});

export const updateInventorySchema = z.object({
  params: getInventorySchema.shape.params,
});

export const deleteInventoriesSchema = z.object({
  body: z.object({
    inventoriesIds: z.array(z.uuid()),
  }),
});
