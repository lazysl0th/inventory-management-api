import type { INotifier } from "../types/base/Notifier.js";
import type { ICommentModel, TComment } from "../types/models/Comment.js";
import type { ICommentService } from "../types/services/Comment.js";

export default class CommentService implements ICommentService {
  constructor(
    private readonly CommentModel: ICommentModel,
    private readonly notifier: INotifier,
  ) {}

  async getComments(inventoryId: number): Promise<TComment[]> {
    return await this.CommentModel.getAll(inventoryId);
  }

  async createComment(
    content: string,
    inventoryId: number,
    userId: number,
  ): Promise<TComment> {
    const comment = await this.CommentModel.create(
      content,
      inventoryId,
      userId,
    );
    this.notifier.notify(`comments:inventoryId=${comment.inventoryId}`, {
      comment,
      channel: `comments:inventoryId=${comment.inventoryId}`,
    });
    return comment;
  }
}
