import type { IUserService } from "../types/services/User.js";
import { NOT_FOUND } from "../constants/response.js";
import {
  RoleName,
  Status,
} from "#/infrastructure/persistence/prisma/generated/enums.js";
import NotFound from "#/domain/errors/NotFound.js";
import type {
  IUserRepository,
  TSafeUser,
  TSafeUserWithRoles,
  TUserBySafeMode,
  TUserCreateData,
  TUserUpdateData,
} from "#/application/user/interfaces/IUserRepository.js";

export default class UserService implements IUserService {
  constructor(private readonly UserModel: IUserRepository) {}

  async getUserById<T extends boolean = true>(
    id: string,
    safeMode: T = true as T,
  ): Promise<TUserBySafeMode<T>> {
    const user = await this.UserModel.getById(id, safeMode);
    if (!user) throw new NotFound(NOT_FOUND.TEXT);
    return user;
  }

  async getUsers(query?: string): Promise<TSafeUserWithRoles[]> {
    return await this.UserModel.getAll(query);
  }

  async createUser(data: TUserCreateData): Promise<TSafeUserWithRoles> {
    const userData = {
      ...data,
      roles: {
        create: [
          {
            role: {
              connectOrCreate: {
                where: { name: RoleName.User },
                create: { name: RoleName.User },
              },
            },
          },
        ],
      },
    };
    return await this.UserModel.create(userData);
  }

  async updateUser(
    id: string,
    data: TUserUpdateData,
  ): Promise<TSafeUserWithRoles> {
    return await this.UserModel.updateById(id, data);
  }

  async updateUserStatus(
    ids: string[],
    status: Status,
  ): Promise<{ count: number }> {
    return await this.UserModel.updateStatusByIds(ids, status);
  }

  async updateUsers(
    ids: string[],
    userData: Partial<TSafeUser>,
  ): Promise<{ count: number }> {
    const whereInputNot = Object.entries(userData).map(([key, value]) => ({
      [key]: { not: value },
    }));
    return await this.UserModel.updateByIds(ids, userData, whereInputNot);
  }

  async deleteUsers(ids: string[]): Promise<{ count: number }> {
    return await this.UserModel.deleteByIds(ids);
  }

  async getEmailAdmins(): Promise<{ email: string }[]> {
    return await this.UserModel.getEmailAdmins();
  }
}
