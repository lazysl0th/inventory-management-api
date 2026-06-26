import type { RequestHandler } from "express";
import type { InjectionToken } from "tsyringe";

import validate from "../../../middlewares/validation.js";
import { getUserSchema } from "#/application/user/dtos/UserDto.js";

export type TSalesForceRoutes = "addInfo" | "getInfo";

export type ISalesForceValidations = Record<TSalesForceRoutes, RequestHandler>;

const salesForceValidations: ISalesForceValidations = {
  addInfo: validate(getUserSchema),
  getInfo: validate(getUserSchema),
};

export const SALES_FORCE_VALIDATIONS_TOKEN: InjectionToken<ISalesForceValidations> =
  Symbol("SALES_FORCE_VALIDATIONS");

export default salesForceValidations;
