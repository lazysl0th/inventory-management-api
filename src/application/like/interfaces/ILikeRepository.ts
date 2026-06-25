import type Like from "#/domain/value-objects/Like.js";

export interface ILikeRepository {
  //getItemLike(userId: string, itemId: number): Promise<Like | null>;
  addItemLike(like: Like): Promise<Like>;
  deleteItemLike(like: Like): Promise<Like>;
  //saveItemLike(like: Like): Promise<Like>;
}
