import type { IRouter } from "express";

export interface IUserRouter {
    router: IRouter;
    initializeRoutes(): void;
}