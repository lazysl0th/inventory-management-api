import type { RequestHandler } from "express";
import type { InjectionToken } from "tsyringe";

import validate from "../../middlewares/validation.js";
import {
  addCommentSchema,
  getCommentsSchema,
} from "#/application/comment/dtos/CommentDto.js";

export type TCommentRoutes = "getComments" | "addComment";

export type ICommentValidations = Record<TCommentRoutes, RequestHandler>;

const commentValidations: ICommentValidations = {
  getComments: validate(getCommentsSchema),
  addComment: validate(addCommentSchema),
};

export const СOMMENT_VALIDATIONS_TOKEN: InjectionToken<ICommentValidations> =
  Symbol("COMMENT_VALIDATIONS");

export default commentValidations;
