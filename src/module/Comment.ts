import { container } from "tsyringe";
import CommentController from "../controllers/Comment.js";
import CommentModel from "../models/Comment.js";
import CommentRouter from "../routers/Comment.js";
import CommentService from "../services/Comment.js";
import type { IWsService } from "../types/services/Ws.js";
import { СOMMENT_VALIDATIONS_TOKEN } from "#/infrastructure/transport/http/comment/commentValidations.js";

export default class CommentModule {
  public readonly router: CommentRouter;

  constructor(wsService: IWsService) {
    this.router = this.init(wsService);
  }
  private init(wsService: IWsService) {
    const commentValidator = container.resolve(СOMMENT_VALIDATIONS_TOKEN);
    const commentModel = new CommentModel();
    const commentService = new CommentService(commentModel, wsService);
    const commentController = new CommentController(commentService);
    return new CommentRouter(commentController, commentValidator);
  }
}
