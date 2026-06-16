import prisma from "../prisma/prisma.js";
import type { IUserRoleModel, TUserRole } from "../types/models/UserRole.js";
import type { Prisma } from "@prisma/client";

export default class UserRoleModel implements IUserRoleModel {
  async createUsersRoles(
    userRoleIds: TUserRole[],
  ): Promise<Prisma.BatchPayload> {
    return prisma.userRole.createMany({
      data: userRoleIds,
      skipDuplicates: true,
    });
  }

  async deleteUsersRoles(
    userIds: number[],
    roleIds: number[],
  ): Promise<Prisma.BatchPayload> {
    return prisma.userRole.deleteMany({
      where: {
        userId: { in: userIds },
        roleId: { in: roleIds },
      },
    });
  }
}
