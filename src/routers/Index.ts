import NotFound from "#/domain/errors/NotFound.js";
import Router from "../base/Router.js";
import { NOT_FOUND } from "../constants/response.js";
import type { IBaseRouter } from "../types/base/Router.js";

export default class IndexRouter extends Router {
  constructor(
    private readonly UserRoleRouter: IBaseRouter,
    //private readonly InventoryRouter: IBaseRouter,
    private readonly ItemRouter: IBaseRouter,
    private readonly IntegrationRouter: IBaseRouter,
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    //this.router.use("/inventories", this.InventoryRouter.router);
    this.router.use("/inventories/:inventoryId/items", this.ItemRouter.router);
    this.router.use("/integration", this.IntegrationRouter.router);
    this.router.use("/roles", this.UserRoleRouter.router);
    this.router.use((req, res, next) => next(new NotFound(NOT_FOUND.TEXT)));
  }
}
