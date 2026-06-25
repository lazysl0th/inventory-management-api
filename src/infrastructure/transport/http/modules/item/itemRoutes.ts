import { Router } from "express";
import type { IItemValidations } from "./itemValidations.js";
import type ItemController from "./ItemController.js";

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
  return router;
};

export default itemRoutes;
