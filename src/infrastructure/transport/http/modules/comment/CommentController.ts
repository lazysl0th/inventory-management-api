import type { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";
import type {
  TAddCommentBody,
  TAddCommentParams,
  TGetCommentsParams,
} from "#/application/comment/dtos/CommentDto.js";
import HttpStatusCode from "../../constants/httpStatusCode.js";
import UnauthorizedError from "#/domain/errors/UnauthorizedError.js";
import GetComments from "#/application/comment/use-cases/GetComments.js";
import CreateComment from "#/application/comment/use-cases/CreateComment.js";
import type Comment from "#/domain/entities/Comment.js";

@injectable()
export default class CommentController {
  constructor(
    @inject(GetComments) private readonly getAll: GetComments,
    @inject(CreateComment) private readonly create: CreateComment,
  ) {}

  getComments: RequestHandler<TGetCommentsParams, Comment[]> = async (
    req,
    res,
  ) => {
    const inventoryId = Number(req.params.inventoryId);
    const comments = await this.getAll.execute(inventoryId);
    res.status(HttpStatusCode.Ok).json(comments);
  };

  addComment: RequestHandler<TAddCommentParams, Comment, TAddCommentBody> =
    async (req, res) => {
      if (!req.isAuthenticated()) {
        throw new UnauthorizedError();
      }
      const inventoryId = Number(req.params.inventoryId);
      const content = req.body.content;
      const userId = req.user.id;
      const comment = await this.create.execute({
        content,
        inventoryId,
        userId,
      });
      res.status(HttpStatusCode.Ok).json(comment);
    };
}
