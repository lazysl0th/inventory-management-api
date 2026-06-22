import { z } from "zod";

export const commentSchema = z.object({
  inventoryId: z.coerce.number().positive().int(),
  content: z.string().trim().min(1),
  userId: z.uuid(),
});

export const getCommentsSchema = z.object({
  params: commentSchema.pick({ inventoryId: true }).extend({
    inventoryId: z.string(),
  }),
});

export const addCommentSchema = z.object({
  params: commentSchema.pick({ inventoryId: true }).extend({
    inventoryId: z.string(),
  }),
  body: commentSchema.pick({ content: true }),
});

export type TGetCommentsParams = z.infer<typeof getCommentsSchema>["params"];

export type TAddCommentParams = z.infer<typeof addCommentSchema>["params"];
export type TAddCommentBody = z.infer<typeof addCommentSchema>["body"];

export type TCreateCommentDto = z.infer<typeof commentSchema>;
