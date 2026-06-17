import type { BatchPayload } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";
import type { IUserRoleModel } from "../types/models/UserRole.js";
import type { IUserRoleService } from "../types/services/UserRole.js";

export default class UserRoleService implements IUserRoleService {
  constructor(private readonly UserRoleModel: IUserRoleModel) {}

  async addRoles(userIds: number[], roleIds: number[]): Promise<BatchPayload> {
    const userRoleIds = userIds.flatMap((userId) =>
      roleIds.map((roleId) => ({ userId, roleId })),
    );
    return this.UserRoleModel.createUsersRoles(userRoleIds);
  }

  async deleteRoles(
    userIds: number[],
    roleIds: number[],
  ): Promise<BatchPayload> {
    return this.UserRoleModel.deleteUsersRoles(userIds, roleIds);
  }
}
