import IndexRouter from "../routers/Index.js";
import IntegrationModule from "./Integration.js";
import InventoryModule from "./Inventory.js";
import ItemModule from "./Item.js";
import UserRoleModule from "./UserRole.js";
import type { IRouter } from "express";

export default class AppModule {
  public readonly router: IRouter;

  constructor() {
    const { indexRouter } = this.init();
    this.router = indexRouter.router;
  }

  private init() {
    const userRole = new UserRoleModule();
    const integration = new IntegrationModule();
    const inventory = new InventoryModule();
    const item = new ItemModule(inventory.service);

    const indexRouter = new IndexRouter(
      userRole.router,
      inventory.router,
      item.router,
      integration.router,
    );
    return { indexRouter };
  }
}
