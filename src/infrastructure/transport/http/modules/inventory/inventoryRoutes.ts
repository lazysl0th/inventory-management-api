import { Router } from "express";
import type { IInventoryValidations } from "./inventoryValidations.js";
import type PassportService from "#/infrastructure/services/passport/PassportService.js";
import type InventoryController from "./InventoryController.js";

const inventoryRoutes = (
  inventoryController: InventoryController,
  inventoryValidations: IInventoryValidations,
  authService: PassportService,
) => {
  const router = Router();
  router.get(
    "/",
    inventoryValidations.getInventories,
    inventoryController.getInventories,
  );
  router.get(
    "/search",
    inventoryValidations.searchInventories,
    inventoryController.searchInventories,
  );
  router.get(
    "/:inventoryId",
    inventoryValidations.getInventory,
    inventoryController.getInventoryById,
  );

  router.get(
    "/token/:inventoryToken",
    inventoryValidations.getInventoryByToken,
    inventoryController.getInventoryByToken,
  );

  router.get("/categories", inventoryController.getInventoryCategories);

  authService.passport.authenticate("jwt", { session: false });
  //this.router.use(Passport.authorize("jwt"));
  router.post(
    "/",
    inventoryValidations.createInventory,
    inventoryController.createInventory,
  );
  router.patch(
    "/:inventoryId",
    inventoryValidations.updateInventory,
    inventoryController.updateInventory,
  );
  router.get(
    "/:inventoryId/getToken",
    inventoryValidations.getInventory,
    inventoryController.getInventoryToken,
  );
  router.delete(
    "/",
    inventoryValidations.deleteInventories,
    inventoryController.deleteInventories,
  );
  //this.router.post('/:inventoryToken/items', this.ItemRouter.router);
  return router;
};

export default inventoryRoutes;
