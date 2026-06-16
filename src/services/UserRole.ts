import type { Prisma } from "@prisma/client";
import type { IUserRoleModel } from "../types/models/UserRole.js";
import type { IUserRoleService } from "../types/services/UserRole.js";

export default class UserRoleService implements IUserRoleService {
  constructor(private readonly UserRoleModel: IUserRoleModel) {}

  async addRoles(
    userIds: number[],
    roleIds: number[],
  ): Promise<Prisma.BatchPayload> {
    const userRoleIds = userIds.flatMap((userId) =>
      roleIds.map((roleId) => ({ userId, roleId })),
    );
    return this.UserRoleModel.createUsersRoles(userRoleIds);
  }

  async deleteRoles(
    userIds: number[],
    roleIds: number[],
  ): Promise<Prisma.BatchPayload> {
    return this.UserRoleModel.deleteUsersRoles(userIds, roleIds);
  }
}
