import { Router } from "express";
import type ItemController from "../../../../../controllers/Item.js";
import type { IItemValidations } from "./itemValidations.js";

const itemRoutes = (
  itemController: ItemController,
  itemValidations: IItemValidations,
) => {
  const router = Router();
  router.get("/", itemValidations.getItems, itemController.getItems);
  router.get("/:itemId", itemValidations.getItem, itemController.getItem);
  //this.router.use(Passport.authorize("jwt"));
  router.post("/", itemValidations.createItem, itemController.createItem);
  router.patch(
    "/:itemId",
    itemValidations.updateItem,
    itemController.updateItem,
  );
  router.delete("/", itemValidations.deleteItems, itemController.deleteItems);
  router.get(
    "/:itemId/likes",
    itemValidations.getItem,
    itemController.getLikesCount,
  );
  router.get("/:itemId/like", itemValidations.getItem, itemController.getLike);
  router.put("/:itemId/like", itemValidations.getItem, itemController.addLike);
  router.delete(
    "/:itemId/like",
    itemValidations.getItem,
    itemController.deleteLike,
  );
  return router;
};

export default itemRoutes;
