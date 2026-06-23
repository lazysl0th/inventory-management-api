import type { RequestHandler } from "express";
import type { InjectionToken } from "tsyringe";

import validate from "../../middlewares/validation.js";
import {
  deleteUsersSchema,
  getUserSchema,
  updateUserSchema,
  updateUsersSchema,
} from "#/application/user/dtos/UserDto.js";

export type TUserRoutes =
  | "getUser"
  | "updateUser"
  | "updateUsers"
  | "deleteUsers";

export type IUserValidations = Record<TUserRoutes, RequestHandler>;

const userValidations: IUserValidations = {
  getUser: validate(getUserSchema),
  updateUser: validate(updateUserSchema),
  updateUsers: validate(updateUsersSchema),
  deleteUsers: validate(deleteUsersSchema),
};

export const USER_VALIDATIONS_TOKEN: InjectionToken<IUserValidations> =
  Symbol("USER_VALIDATIONS");

export default userValidations;
