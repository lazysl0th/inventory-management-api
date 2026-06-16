import InventoryController from "../controllers/Inventory.js";
import InventoryModel from "../models/Inventory.js";
import InventoryRouter from "../routers/Inventory.js";
import InventoryService from "../services/Inventory.js";
import InventoryValidator from "../validators/Inventory.js";

export default class InventoryModule {
  public readonly router: InventoryRouter;
  public readonly service: InventoryService;

  constructor() {
    const { service, router } = this.init();
    this.service = service;
    this.router = router;
  }

  private init() {
    const service = new InventoryService(new InventoryModel());
    const controller = new InventoryController(service);
    const router = new InventoryRouter(controller, new InventoryValidator());
    return { service, router };
  }
}
