import type { RequestHandler } from "express";
import type { InjectionToken } from "tsyringe";

import validate from "../../middlewares/validation.js";
import {
  resetPasswordSchema,
  signinSchema,
  signupSchema,
} from "#/application/auth/dtos/AuthDto.js";

export type TAuthRoutes = "signin" | "signup" | "resetPassword";

export type IAuthValidations = Record<TAuthRoutes, RequestHandler>;

const authValidations: IAuthValidations = {
  signin: validate(signinSchema),
  signup: validate(signupSchema),
  resetPassword: validate(resetPasswordSchema),
};

export const AUTH_VALIDATIONS_TOKEN: InjectionToken<IAuthValidations> =
  Symbol("AUTH_VALIDATIONS");

export default authValidations;
