import { Router } from "express";
import type { IInventoryValidations } from "./inventoryValidations.js";
import type PassportService from "#/infrastructure/services/passport/PassportService.js";
import type InventoryController from "./InventoryController.js";

const inventoryRoutes = (
  inventoryController: InventoryController,
  inventoryValidator: IInventoryValidations,
  authService: PassportService,
) => {
  const router = Router();
  router.get(
    "/",
    inventoryValidator.getInventories,
    inventoryController.getInventories,
  );
  router.get(
    "/search",
    inventoryValidator.searchInventories,
    inventoryController.searchInventories,
  );
  router.get(
    "/:inventoryId",
    inventoryValidator.getInventory,
    inventoryController.getInventoryById,
  );

  router.get(
    "/token/:inventoryToken",
    inventoryValidator.getInventoryByToken,
    inventoryController.getInventoryByToken,
  );

  router.get("/categories", inventoryController.getInventoryCategories);

  authService.passport.authenticate("jwt", { session: false });
  //this.router.use(Passport.authorize("jwt"));
  router.post("/", inventoryController.createInventory);
  router.patch(
    "/:inventoryId",
    inventoryValidator.updateInventory,
    inventoryController.updateInventory,
  );
  router.get(
    "/:inventoryId/getToken",
    inventoryValidator.getInventory,
    inventoryController.getInventoryToken,
  );
  router.delete(
    "/",
    inventoryValidator.deleteInventories,
    inventoryController.deleteInventories,
  );
  //this.router.post('/:inventoryToken/items', this.ItemRouter.router);
  return router;
};

export default inventoryRoutes;
