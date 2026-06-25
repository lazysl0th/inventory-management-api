import { commentSchema } from "#/domain/entities/Comment.js";
import { z } from "zod";

export const getCommentsSchema = z.object({
  params: commentSchema.pick({ inventoryId: true }),
});

export const addCommentSchema = z.object({
  params: commentSchema.pick({ inventoryId: true }),
  body: commentSchema.pick({ content: true }),
});

export type TGetCommentsParams = z.infer<typeof getCommentsSchema>["params"];

export type TAddCommentParams = z.infer<typeof addCommentSchema>["params"];
export type TAddCommentBody = z.infer<typeof addCommentSchema>["body"];
