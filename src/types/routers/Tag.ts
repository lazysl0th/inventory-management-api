import type { IRouter } from "express";

export interface ITagRouter {
  router: IRouter;
  initializeRoutes(): void;
}
