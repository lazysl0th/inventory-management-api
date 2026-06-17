import type { BatchPayload } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";

export interface IUserRoleService {
  addRoles(userIds: number[], roleIds: number[]): Promise<BatchPayload>;
  deleteRoles(userIds: number[], roleIds: number[]): Promise<BatchPayload>;
}
