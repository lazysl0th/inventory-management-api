import type { Prisma } from "@prisma/client";
import type { Settings } from "../settings.js";

export type TComment = Prisma.CommentGetPayload<{select: Settings['selects']['comment']}>;

export type TCommentCreateData = Prisma.CommentCreateInput;

export interface ICommentModel {
    getAll(inventoryId: number): Promise<TComment[]>;
    create(content: string, inventoryId: number, userId: number): Promise<TComment>;
}