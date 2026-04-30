import type { Prisma, Status } from "@prisma/client";
import Model from "../base/Model.js";
import type { IUserModel, TSafeUserSelect, TSafeUserWithRoles, TUserBySafeMode, TUserCreateData, TUserUpdateData, TUserWithRoles } from "../types/models/User.js";
import prisma from '../prisma/prisma.js'
import type { TProvider } from "../types/services/Auth.js";
import { USER_SELECT } from "../constants/selects.js";

export default class UserModel extends Model<TSafeUserWithRoles, TUserCreateData, TUserUpdateData> implements IUserModel {
    private userSelect = USER_SELECT;

    get userSelectSafe(): TSafeUserSelect {
        const {password, resetPasswordToken, refreshToken, createdAt, ...safeUserSelect} = this.userSelect;
        return safeUserSelect;
    }

    async getAll(query?: string): Promise<TSafeUserWithRoles[]> {
        return await prisma.user.findMany({ 
            ...(query && { where: { email: { contains: query, mode: 'insensitive' } } }),
            select: this.userSelectSafe
        });
    }

    async getById<T extends boolean = true>(id: number, safeMode: T = true as T): Promise<TUserBySafeMode<T> | null> {
        return await prisma.user.findUnique({
            where: { id },
            ...( safeMode
                ? { select: this.userSelectSafe }
                : { select: this.userSelect }
            )
        }) as TUserBySafeMode<T> | null;
    }

    async getByEmail(email: string): Promise<TUserWithRoles | null> {
        return await prisma.user.findUnique({ 
            where: { email },
            select: this.userSelect
        })
    }

    async getBySocialId(provider: TProvider, socialId: string): Promise<TSafeUserWithRoles | null> {
        return await prisma.user.findUnique({
            where: { [provider]: socialId } as unknown as Prisma.UserWhereUniqueInput,
            select: this.userSelectSafe
        })
    }

    async getEmailAdmins(): Promise<{ email: string }[]> {
        return await prisma.user.findMany({ 
            where: { roles: { some: { role: { name: "Admin" } } } },
            select: {
                email: true,
            }
        });
    }

    async create(data: TUserCreateData): Promise<TSafeUserWithRoles> {
        return await prisma.user.create({
            data,
            select: this.userSelectSafe,
        });
    }

    async updateById(id: number, data: TUserUpdateData): Promise<TSafeUserWithRoles> {
        return prisma.user.update({
            where: { id },
            data,
            select: this.userSelectSafe,
        });
    }

    async updateStatusByIds (ids: number[], status: Status): Promise<{ count: number }> {
        return await prisma.user.updateMany({
                where: {
                    id: { in: ids },
                    status: { not: status },
                },
                data: { status },
            });
    }

    async updateByIds (ids: number[], data: Partial<TSafeUserWithRoles>, whereNot: Prisma.UserWhereInput[]): Promise<{ count: number }> {
        return await prisma.user.updateMany({
                where: {
                    id: { in: ids },
                    AND: whereNot,
                },
                data,
            });
    }

    async updatePasswordByToken (token: string, hash: string): Promise<{ count: number }> {
        return await prisma.user.updateMany({
            where: { resetPasswordToken: token },
            data: {
                password: hash,
                resetPasswordToken: '',
            },
        });
    }

    async deleteByIds(ids: number[]): Promise<{ count: number }> {
        return await prisma.user.deleteMany({
            where: { id: { in: ids } },
        });
    }
}