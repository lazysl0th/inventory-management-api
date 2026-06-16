import type { Prisma } from "@prisma/client";

export interface IUserRoleService {
  addRoles(userIds: number[], roleIds: number[]): Promise<Prisma.BatchPayload>;
  deleteRoles(
    userIds: number[],
    roleIds: number[],
  ): Promise<Prisma.BatchPayload>;
}
