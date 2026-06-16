import type { IRouter } from "express";

export interface IAuthRouter {
  router: IRouter;
  initializeRoutes(): void;
}
