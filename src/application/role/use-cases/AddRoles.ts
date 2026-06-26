import { inject, injectable } from "tsyringe";
import type { TChangeRoleResult } from "../dtos/RoleDto.js";
import type { IRoleRepository } from "../interfaces/IRoleRepository.js";

@injectable()
export default class AddRoles {
  constructor(
    @inject("RoleRepository") private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(
    userIds: string[],
    roleIds: string[],
  ): Promise<TChangeRoleResult> {
    const userRoleIds = userIds.flatMap((userId) =>
      roleIds.map((roleId) => ({ userId, roleId })),
    );
    return this.roleRepository.createUsersRoles(userRoleIds);
  }
}
