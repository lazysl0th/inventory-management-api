import type { RequestHandler } from "express";
import type { InjectionToken } from "tsyringe";

import validate from "../../middlewares/validation.js";
import {
  resetPasswordSchema,
  localSigninSchema,
  signupSchema,
  changePasswordSchema,
} from "#/application/auth/dtos/AuthDto.js";

export type TAuthRoutes =
  | "signin"
  | "signup"
  | "resetPassword"
  | "changePassword";

export type IAuthValidations = Record<TAuthRoutes, RequestHandler>;

const authValidations: IAuthValidations = {
  signin: validate(localSigninSchema),
  signup: validate(signupSchema),
  resetPassword: validate(resetPasswordSchema),
  changePassword: validate(changePasswordSchema),
};

export const AUTH_VALIDATIONS_TOKEN: InjectionToken<IAuthValidations> =
  Symbol("AUTH_VALIDATIONS");

export default authValidations;
