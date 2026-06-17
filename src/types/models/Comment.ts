import type {
  CommentCreateInput,
  CommentGetPayload,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import type { Settings } from "../settings.js";

export type TComment = CommentGetPayload<{
  select: Settings["selects"]["comment"];
}>;

export type TCommentCreateData = CommentCreateInput;

export interface ICommentModel {
  getAll(inventoryId: number): Promise<TComment[]>;
  create(
    content: string,
    inventoryId: number,
    userId: number,
  ): Promise<TComment>;
}
