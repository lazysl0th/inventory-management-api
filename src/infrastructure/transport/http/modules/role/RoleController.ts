import type { RequestHandler } from "express";
import HttpStatusCode from "../../constants/httpStatusCode.js";
import type {
  TChangeRoleBody,
  TChangeRoleResult,
} from "#/application/role/dtos/RoleDto.js";
import { inject, injectable } from "tsyringe";
import AddRoles from "#/application/role/use-cases/AddRoles.js";
import DeleteRoles from "#/application/role/use-cases/DeleteRoles.js";

@injectable()
export default class RoleController {
  constructor(
    @inject(AddRoles) private readonly addUsersRoles: AddRoles,
    @inject(DeleteRoles) private readonly deleteUsersRoles: DeleteRoles,
  ) {}

  addRoles: RequestHandler<never, TChangeRoleResult, TChangeRoleBody> = async (
    req,
    res,
  ) => {
    const userIds = req.body.userIds;
    const roleIds = req.body.roleIds;
    const result = await this.addUsersRoles.execute(userIds, roleIds);
    res.status(HttpStatusCode.Ok).json(result);
  };

  deleteRoles: RequestHandler<never, TChangeRoleResult, TChangeRoleBody> =
    async (req, res) => {
      const userIds = req.body.userIds;
      const roleIds = req.body.roleIds;
      const result = await this.deleteUsersRoles.execute(userIds, roleIds);
      res.status(HttpStatusCode.Ok).json(result);
    };
}
