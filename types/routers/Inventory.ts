import type { IRouter } from "express";

export interface IInventoryRouter {
    router: IRouter;
    initializeRoutes(): void;
}