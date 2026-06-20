import IndexRouter from "../routers/Index.js";
import AuthModule from "./Auth.js";
import IntegrationModule from "./Integration.js";
import InventoryModule from "./Inventory.js";
import ItemModule from "./Item.js";
import PassportStrategyModule from "./PassportStrategy.js";
import UserModule from "./User.js";
import UserRoleModule from "./UserRole.js";
import type { IRouter } from "express";

export default class AppModule {
  public readonly router: IRouter;
  public readonly passport: PassportStrategyModule;

  constructor() {
    const { passport, indexRouter } = this.init(/*wsServer*/);
    this.passport = passport;
    this.router = indexRouter.router;
  }

  private init() {
    const user = new UserModule();
    const userRole = new UserRoleModule();
    const auth = new AuthModule(user.service);
    const integration = new IntegrationModule(user.service);
    const inventory = new InventoryModule();
    const item = new ItemModule(inventory.service);

    const passport = new PassportStrategyModule(auth.service, user.service);
    const indexRouter = new IndexRouter(
      auth.router,
      user.router,
      userRole.router,
      inventory.router,
      item.router,
      integration.router,
    );
    return { passport, indexRouter };
  }
}
