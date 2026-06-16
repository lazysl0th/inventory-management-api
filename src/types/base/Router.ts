import type { IRouter } from "express";

export interface IBaseRouter {
  router: IRouter;
  initializeRoutes(): void;
}
