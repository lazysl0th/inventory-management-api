import type Comment from "#/domain/entities/Comment.js";
import type {
  CommentCreateInput,
  CommentGetPayload,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import type { TCreateCommentDto } from "../dtos/CommentDto.js";

export type TComment = CommentGetPayload<{
  include: {
    user: {
      select: {
        name: true;
      };
    };
  };
}>;

export type TCommentCreateData = CommentCreateInput;

export interface ICommentRepository {
  getAll(inventoryId: number): Promise<Comment[]>;
  create(commentData: TCreateCommentDto): Promise<Comment>;
}
