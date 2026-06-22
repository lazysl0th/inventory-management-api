import type { BatchPayload } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";

export interface IUserRoleService {
  addRoles(userIds: string[], roleIds: number[]): Promise<BatchPayload>;
  deleteRoles(userIds: string[], roleIds: number[]): Promise<BatchPayload>;
}
