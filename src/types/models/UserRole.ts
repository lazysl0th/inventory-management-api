import type { BatchPayload } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";
import type { UserRoleGetPayload } from "#/infrastructure/persistence/prisma/generated/models.js";

export type TUserRole = UserRoleGetPayload<true>;

export interface IUserRoleModel {
  createUsersRoles(userRoleIds: TUserRole[]): Promise<BatchPayload>;
  deleteUsersRoles(
    usersIds: number[],
    rolesIds: number[],
  ): Promise<BatchPayload>;
}
