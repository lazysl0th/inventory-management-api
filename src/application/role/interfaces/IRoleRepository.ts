import type { TChangeRoleResult, TRole } from "../dtos/RoleDto.js";

export interface IRoleRepository {
  createUsersRoles(userRoleIds: TRole[]): Promise<TChangeRoleResult>;
  deleteUsersRoles(
    usersIds: string[],
    rolesIds: string[],
  ): Promise<TChangeRoleResult>;
}
