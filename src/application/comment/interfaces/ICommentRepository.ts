import type Comment from "#/domain/entities/Comment.js";

export interface ICommentRepository {
  getAll(inventoryId: string): Promise<Comment[]>;
  save(comment: Comment): Promise<Comment>;
}
