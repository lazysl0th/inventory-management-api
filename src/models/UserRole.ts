import { container } from "tsyringe";
import type { IUserRoleModel, TUserRole } from "../types/models/UserRole.js";
import Prisma from "#/infrastructure/persistence/prisma/prisma.js";
import type { BatchPayload } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";

export default class UserRoleModel implements IUserRoleModel {
  prisma: Prisma;
  constructor(/*@inject(Prisma) private readonly prisma: Prisma*/) {
    this.prisma = container.resolve(Prisma);
  }
  async createUsersRoles(userRoleIds: TUserRole[]): Promise<BatchPayload> {
    return this.prisma.client.userRole.createMany({
      data: userRoleIds,
      skipDuplicates: true,
    });
  }

  async deleteUsersRoles(
    userIds: string[],
    roleIds: number[],
  ): Promise<BatchPayload> {
    return this.prisma.client.userRole.deleteMany({
      where: {
        userId: { in: userIds },
        roleId: { in: roleIds },
      },
    });
  }
}
