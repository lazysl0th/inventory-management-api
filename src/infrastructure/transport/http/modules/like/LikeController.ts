import { inject, injectable } from "tsyringe";
import type { RequestHandler } from "express";
import type {
  TAddItemLikeParams,
  TDeleteItemLikeParams,
} from "#/application/like/dtos/LikeDtos.js";
import type Like from "#/domain/value-objects/Like.js";
import HttpStatusCode from "../../constants/httpStatusCode.js";
import AddItemLike from "#/application/like/use-cases/AddItemLike.js";
import UnauthorizedError from "#/domain/errors/UnauthorizedError.js";
import DeleteItemLike from "#/application/like/use-cases/DeleteItemLike.js";

@injectable()
export default class LikeController {
  constructor(
    @inject(AddItemLike) private readonly addItemLike: AddItemLike,
    @inject(DeleteItemLike) private readonly deleteItemLike: DeleteItemLike,
  ) {}

  addLike: RequestHandler<TAddItemLikeParams, Like> = async (req, res) => {
    /*if (!req.isAuthenticated()) {
            throw new UnauthorizedError();
            }*/
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError();
    }
    const itemId = req.params.itemId;
    const result = await this.addItemLike.execute({ userId, itemId });
    res.status(HttpStatusCode.Ok).json(result);
  };

  deleteLike: RequestHandler<TDeleteItemLikeParams> = async (req, res) => {
    /*if (!req.isAuthenticated()) {
            throw new UnauthorizedError();
            }*/
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError();
    }
    const itemId = req.params.itemId;
    const result = await this.deleteItemLike.execute({ userId, itemId });
    res.status(HttpStatusCode.Ok).json(result);
  };

  /*getLikesCount: RequestHandler<TGetItemParams, { count: number }> = async (
    req,
    res,
  ) => {
    const itemId = req.params.itemId;
    const result = await this.ItemService.getLikesCount(Number(itemId));
    res.status(HttpStatusCode.Ok).json({ count: result });
  };

  getLike: RequestHandler<TGetItemParams> = async (req, res) => {
    /*if (!req.isAuthenticated()) {
            throw new UnauthorizedError();
            }
    const userId = req.user?.id;
    const itemId = req.params.itemId;
    const result = await this.ItemService.getLike(userId, Number(itemId));
    res.status(HttpStatusCode.Ok).json({ count: result });
  };*/
}
