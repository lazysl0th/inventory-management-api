import { inject, injectable } from "tsyringe";
import type { TChangeRoleResult } from "../dtos/RoleDto.js";
import type { IRoleRepository } from "../interfaces/IRoleRepository.js";

@injectable()
export default class DeleteRoles {
  constructor(
    @inject("RoleRepository") private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(
    userIds: string[],
    roleIds: string[],
  ): Promise<TChangeRoleResult> {
    return this.roleRepository.deleteUsersRoles(userIds, roleIds);
  }
}
