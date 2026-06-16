import Router from "../base/Router.js";
import type { IBaseRouter } from "../types/base/Router.js";
import type { ITagController } from "../types/controllers/Tag.js";

export default class TagRouter extends Router implements IBaseRouter {
  constructor(private readonly TagController: ITagController) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get("/", this.TagController.getTags);
  }
}
