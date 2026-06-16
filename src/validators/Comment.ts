import type { Handler } from "express";
import Validator from "../base/Validator.js";
import { Joi, Segments } from "celebrate";
import type { ICommentValidator } from "../types/validators/Comment.js";

export default class CommentValidator
  extends Validator
  implements ICommentValidator
{
  getComments(): Handler {
    return this.validate(
      {
        [Segments.PARAMS]: Joi.object().keys({
          inventoryId: this.idSchema,
        }),
      },
      { convert: true },
    );
  }
  createComment(): Handler {
    return this.validate(
      {
        [Segments.PARAMS]: Joi.object().keys({
          inventoryId: this.idSchema,
        }),
        [Segments.BODY]: Joi.object().keys({
          content: this.stringRequiredSchema,
        }),
      },
      { convert: true },
    );
  }
}
