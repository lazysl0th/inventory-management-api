import type { Handler } from "express";
import Validator from "../base/Validator.js";
import { Joi, Segments } from "celebrate";
import type { IIntegrationValidator } from "../types/validators/Integration.js";

export default class IntegrationValidator
  extends Validator
  implements IIntegrationValidator
{
  addAditionalInfo(): Handler {
    return this.validate(
      {
        [Segments.PARAMS]: Joi.object().keys({
          userId: this.idSchema,
        }),
      },
      { convert: true },
    );
  }
}
