import { Controller } from "../base/Controller.js";
import type { Handler } from "express";
import type { IParamInventoryId } from "../types/controllers/Inventory.js";
import type {
  IBodyCreateComment,
  ICommentController,
} from "../types/controllers/Comment.js";
import type { ICommentService } from "../types/services/Comment.js";
import type { TComment } from "../types/models/Comment.js";

export default class CommentController
  extends Controller
  implements ICommentController
{
  constructor(private readonly CommentService: ICommentService) {
    super();
  }

  getComments: Handler = this.handle<IParamInventoryId>(async (req, res) => {
    const inventoryId = req.params.inventoryId;
    const comments = await this.CommentService.getComments(inventoryId);
    this.ok<TComment[]>(res, comments);
  });

  createComment: Handler = this.handle<IParamInventoryId, IBodyCreateComment>(
    async (req, res) => {
      const inventoryId = req.params.inventoryId;
      const userId = req.user.id;
      const content = req.body.content;
      const comments = await this.CommentService.createComment(
        content,
        inventoryId,
        userId,
      );
      this.ok<TComment>(res, comments);
    },
  );
}
