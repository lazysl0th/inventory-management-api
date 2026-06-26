import type { RequestHandler } from "express";
import type { InjectionToken } from "tsyringe";

import validate from "../../middlewares/validation.js";
import { changeRolesSchema } from "#/application/role/dtos/RoleDto.js";

export type TRoleRoutes = "changeRoles";

export type IRoleValidations = Record<TRoleRoutes, RequestHandler>;

const roleValidations: IRoleValidations = {
  changeRoles: validate(changeRolesSchema),
};

export const ROLE_VALIDATIONS_TOKEN: InjectionToken<IRoleValidations> =
  Symbol("ROLE_VALIDATIONS");

export default roleValidations;
