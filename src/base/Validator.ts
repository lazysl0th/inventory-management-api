import {
  celebrate,
  Joi,
  type CelebrateOptions,
  type SchemaOptions,
} from "celebrate";
import type { Handler } from "express";
import type { IValidationOptions } from "../types/base/Validator.js";

export default abstract class Validator {
  protected idSchema = Joi.number().integer().positive().required();
  protected emailSchema = Joi.string().required().email();
  protected stringRequiredSchema = Joi.string().required();
  protected stringOptionalSchema = Joi.string().optional();
  protected numberOptionalSchema = Joi.number().integer().positive().optional();
  protected booleanOptionalSchema = Joi.boolean().optional();
  protected numberArrayRequiredSchema = Joi.array()
    .items(Joi.number().integer().positive())
    .required();

  protected validate(
    validationRule: Partial<SchemaOptions>,
    joiOptions?: IValidationOptions,
    celebrateOptions?: CelebrateOptions,
  ): Handler {
    return celebrate(validationRule, joiOptions, celebrateOptions);
  }
}
