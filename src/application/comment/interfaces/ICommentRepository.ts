import type Comment from "#/domain/entities/Comment.js";

export interface ICommentRepository {
  getAll(inventoryId: number): Promise<Comment[]>;
  save(comment: Comment): Promise<void>;
}
