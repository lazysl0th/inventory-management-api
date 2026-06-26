import { inject, injectable } from "tsyringe";
import Prisma from "#/infrastructure/persistence/prisma/prisma.js";
import type { IRoleRepository } from "#/application/role/interfaces/IRoleRepository.js";
import type {
  TChangeRoleResult,
  TRole,
} from "#/application/role/dtos/RoleDto.js";

@injectable()
export default class PrismaRoleRepository implements IRoleRepository {
  constructor(@inject(Prisma) private readonly prisma: Prisma) {}
  async createUsersRoles(userRoleIds: TRole[]): Promise<TChangeRoleResult> {
    return this.prisma.client.userRole.createMany({
      data: userRoleIds,
      skipDuplicates: true,
    });
  }

  async deleteUsersRoles(
    userIds: string[],
    roleIds: string[],
  ): Promise<TChangeRoleResult> {
    return this.prisma.client.userRole.deleteMany({
      where: {
        userId: { in: userIds },
        roleId: { in: roleIds },
      },
    });
  }
}
