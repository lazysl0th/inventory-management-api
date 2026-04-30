import type { IRouter } from "express";

export interface ISalesForceRouter {
    router: IRouter;
    initializeRoutes(): void;
}