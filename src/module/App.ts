import IndexRouter from "../routers/Index.js";
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

    const indexRouter = new IndexRouter(userRole.router);
    return { indexRouter };
  }
}
