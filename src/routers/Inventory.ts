import type { IInventoryController } from "../types/controllers/Inventory.js";
import type { IInventoryRouter } from "../types/routers/Inventory.js";
import Router from "../base/Router.js";
import type { IInventoryValidator } from "../types/validators/Inventory.js";

export default class InventoryRouter
  extends Router
  implements IInventoryRouter
{
  constructor(
    private readonly InventoryController: IInventoryController,
    private readonly InventoryValidator: IInventoryValidator,
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get(
      "/",
      this.InventoryValidator.getInventories(),
      this.InventoryController.getInventories,
    );
    this.router.get(
      "/search",
      this.InventoryValidator.searchInventories(),
      this.InventoryController.searchInventories,
    );
    this.router.get(
      "/categories",
      this.InventoryController.getInventoryCategories,
    );
    this.router.get(
      "/:inventoryId",
      this.InventoryValidator.getInventory(),
      this.InventoryController.getInventoryById,
    );
    this.router.get(
      "/token/:inventoryToken",
      this.InventoryController.getInventoryByToken,
    );
    //this.router.use(Passport.authorize("jwt"));
    this.router.post("/", this.InventoryController.createInventory);
    this.router.patch(
      "/:inventoryId",
      this.InventoryValidator.updateInventory(),
      this.InventoryController.updateInventory,
    );
    this.router.get(
      "/:inventoryId/getToken",
      this.InventoryValidator.getInventory(),
      this.InventoryController.getTokenInventory,
    );
    this.router.delete(
      "/",
      this.InventoryValidator.deleteInventories(),
      this.InventoryController.deleteInventories,
    );
    this.router.get(
      "/token/:inventoryToken",
      this.InventoryValidator.getInventoryByToken(),
      this.InventoryController.getInventoryByToken,
    );
    //this.router.post('/:inventoryToken/items', this.ItemRouter.router);
  }
}
