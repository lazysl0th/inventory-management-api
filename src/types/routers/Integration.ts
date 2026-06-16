import type { IRouter } from "express";

export interface IIntegrationRouter {
  router: IRouter;
  initializeRoutes(): void;
}
