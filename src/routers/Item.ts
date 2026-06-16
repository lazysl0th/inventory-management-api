import Passport from "../base/Passport.js";
import Router from "../base/Router.js";
import type { IItemController } from "../types/controllers/Item.js";
import type { IItemRouter } from "../types/routers/Item.js";
import type { IItemValidator } from "../types/validators/Item.js";

export default class ItemRouter extends Router implements IItemRouter {
  constructor(
    private readonly ItemController: IItemController,
    private readonly ItemValidator: IItemValidator,
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get(
      "/",
      this.ItemValidator.getItems(),
      this.ItemController.getItems,
    );
    this.router.get(
      "/:itemId",
      this.ItemValidator.getItem(),
      this.ItemController.getItem,
    );
    this.router.use(Passport.authorize("jwt"));
    this.router.post(
      "/",
      this.ItemValidator.createItem(),
      this.ItemController.createItem,
    );
    this.router.patch(
      "/:itemId",
      this.ItemValidator.updateItem(),
      this.ItemController.updateItem,
    );
    this.router.delete(
      "/",
      this.ItemValidator.deleteItems(),
      this.ItemController.deleteItems,
    );
    this.router.get(
      "/:itemId/likes",
      this.ItemValidator.getItem(),
      this.ItemController.getLikesCount,
    );
    this.router.get(
      "/:itemId/like",
      this.ItemValidator.getItem(),
      this.ItemController.getLike,
    );
    this.router.put(
      "/:itemId/like",
      this.ItemValidator.getItem(),
      this.ItemController.addLike,
    );
    this.router.delete(
      "/:itemId/like",
      this.ItemValidator.getItem(),
      this.ItemController.deleteLike,
    );
  }
}
