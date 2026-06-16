import express, { type IRouter } from "express";

export default abstract class Router {
  public readonly router: IRouter;

  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  abstract initializeRoutes(): void;
}
