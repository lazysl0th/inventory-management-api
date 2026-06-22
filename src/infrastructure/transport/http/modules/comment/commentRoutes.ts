import { Router } from "express";
//import Passport from "../../../../../base/Passport.js";
import type { ICommentValidations } from "./commentValidations.js";
import type CommentController from "./CommentController.js";

const commentRoutes = (
  commentController: CommentController,
  commentValidations: ICommentValidations,
): Router => {
  const router = Router();
  router.get(
    "/inventories/:inventoryId",
    commentValidations.getComments,
    commentController.getComments,
  );
  router.post(
    "/inventories/:inventoryId",
    //Passport.authorize("jwt"),
    commentValidations.addComment,
    commentController.addComment,
  );
  return router;
};

export default commentRoutes;
