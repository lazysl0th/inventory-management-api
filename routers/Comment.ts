import Passport from "../base/Passport.js";
import Router from "../base/Router.js";
import type { ICommentController } from "../types/controllers/Comment.js";
import type { ICommentRouter } from "../types/routers/Comment.js";
import type { ICommentValidator } from "../types/validators/Comment.js";

export default class CommentRouter extends Router implements ICommentRouter {
    constructor(
        private readonly CommentController: ICommentController,
        private readonly CommentValidator: ICommentValidator,
    ) {
        super();
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        this.router.get('/inventories/:inventoryId', this.CommentValidator.getComments(), this.CommentController.getComments);
        this.router.post('/inventories/:inventoryId', Passport.authorize('jwt'), this.CommentValidator.createComment(), this.CommentController.createComment);
    }
}