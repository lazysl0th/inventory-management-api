import type { IRouter } from "express";

export interface IItemRouter {
    router: IRouter;
    initializeRoutes(): void;
}