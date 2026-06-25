import type { RequestHandler } from "express";
import type { InjectionToken } from "tsyringe";

import validate from "../../middlewares/validation.js";
import {
  addItemLikeSchema,
  deleteItemLikeSchema,
} from "#/application/like/dtos/LikeDtos.js";

export type TLikeRoutes = "addItemLikes" | "deleteItemLikes";

export type ILikeValidations = Record<TLikeRoutes, RequestHandler>;

const likeValidations: ILikeValidations = {
  addItemLikes: validate(addItemLikeSchema),
  deleteItemLikes: validate(deleteItemLikeSchema),
};

export const LIKE_VALIDATIONS_TOKEN: InjectionToken<ILikeValidations> =
  Symbol("LIKE_VALIDATIONS");

export default likeValidations;
