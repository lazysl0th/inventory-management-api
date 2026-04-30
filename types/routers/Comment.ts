import type { IRouter } from "express";

export interface ICommentRouter {
    router: IRouter;
    initializeRoutes(): void;
}