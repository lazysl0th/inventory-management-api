import { Controller } from "../base/Controller.js";
import type { Handler } from "express";
import type {
  IBodyUserRole,
  IUserRoleController,
} from "../types/controllers/UserRole.js";
import type { IUserRoleService } from "../types/services/UserRole.js";
import type { BatchPayload } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";

export default class UserRoleController
  extends Controller
  implements IUserRoleController
{
  constructor(private readonly UserRoleService: IUserRoleService) {
    super();
  }

  addRoles: Handler = this.handle<object, IBodyUserRole>(async (req, res) => {
    const userIds = req.body.userIds;
    const roleIds = req.body.roleIds;
    const result = await this.UserRoleService.addRoles(userIds, roleIds);
    this.ok<BatchPayload>(res, result);
  });

  deleteRoles: Handler = this.handle<object, IBodyUserRole>(
    async (req, res) => {
      const userIds = req.body.userIds;
      const roleIds = req.body.roleIds;
      const result = await this.UserRoleService.deleteRoles(userIds, roleIds);
      this.ok<BatchPayload>(res, result);
    },
  );
}
