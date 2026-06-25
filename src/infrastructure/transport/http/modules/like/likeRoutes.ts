import { Router } from "express";
import type LikeController from "./LikeController.js";
import type { ILikeValidations } from "./likeValidations.js";

const likeRoutes = (
  likeController: LikeController,
  likeValidations: ILikeValidations,
) => {
  const router = Router();
  /*router.get(
    "/:item/likes",
    likeValidations.getItem,
    likeController.getLikesCount,
  );*/
  //router.get("/item/:itemId", likeValidations.getItemLikes, likeController.getLike);
  router.put(
    "/item/:itemId",
    likeValidations.addItemLikes,
    likeController.addLike,
  );
  router.delete(
    "/item/:itemId",
    likeValidations.deleteItemLikes,
    likeController.deleteLike,
  );
  return router;
};

export default likeRoutes;
