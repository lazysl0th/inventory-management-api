import type { ICommentValidations } from "#/infrastructure/transport/http/comment/commentValidations.js";
import Passport from "../base/Passport.js";
import Router from "../base/Router.js";
import type { ICommentController } from "../types/controllers/Comment.js";
import type { ICommentRouter } from "../types/routers/Comment.js";

export default class CommentRouter extends Router implements ICommentRouter {
  constructor(
    private readonly CommentController: ICommentController,
    private readonly CommentValidator: ICommentValidations,
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get(
      "/inventories/:inventoryId",
      this.CommentValidator.getComments,
      this.CommentController.getComments,
    );
    this.router.post(
      "/inventories/:inventoryId",
      Passport.authorize("jwt"),
      this.CommentValidator.addComment,
      this.CommentController.createComment,
    );
  }
}
