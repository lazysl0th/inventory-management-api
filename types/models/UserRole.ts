import type { Prisma } from "@prisma/client";

export type TUserRole = Prisma.UserRoleGetPayload<true>;

export interface IUserRoleModel {
    createUsersRoles (userRoleIds: TUserRole[]): Promise<Prisma.BatchPayload>;
    deleteUsersRoles (usersIds: number[], rolesIds: number[]): Promise<Prisma.BatchPayload>
}