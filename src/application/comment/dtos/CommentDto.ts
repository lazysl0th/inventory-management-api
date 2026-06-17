import { z } from "zod";

export const getCommentsSchema = z.object({
  params: z.object({
    inventoryId: z.coerce.number().positive().int(),
  }),
});

export const addCommentSchema = z.object({
  params: getCommentsSchema.shape.params,
  body: z.object({
    content: z.string().trim().min(1),
  }),
});

export type TGetCommentsDto = z.infer<typeof getCommentsSchema>["params"];

export type TAddCommentDto = z.infer<typeof addCommentSchema>["params"] &
  z.infer<typeof addCommentSchema>["body"];
