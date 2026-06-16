import { RoleName, type Status } from "@prisma/client";
import NotFound from "../errors/NotFound.js";
import type {
  IUserModel,
  TSafeUser,
  TSafeUserWithRoles,
  TUserBySafeMode,
  TUserCreateData,
  TUserUpdateData,
  TUserWithRoles,
} from "../types/models/User.js";
import type { IUserService } from "../types/services/User.js";
import type { TProvider } from "../types/services/Auth.js";
import { NOT_FOUND } from "../constants/response.js";

export default class UserService implements IUserService {
  constructor(private readonly UserModel: IUserModel) {}

  async getUserById<T extends boolean = true>(
    id: number,
    safeMode: T = true as T,
  ): Promise<TUserBySafeMode<T>> {
    const user = await this.UserModel.getById(id, safeMode);
    if (!user) throw new NotFound(NOT_FOUND.TEXT);
    return user;
  }

  async getUserByEmail(email: string): Promise<TUserWithRoles> {
    const user = await this.UserModel.getByEmail(email);
    if (!user) throw new NotFound(NOT_FOUND.TEXT);
    return user;
  }

  async getUserBySocialId(
    provider: TProvider,
    socialId: string,
  ): Promise<TSafeUserWithRoles | null> {
    return await this.UserModel.getBySocialId(provider, socialId);
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
    id: number,
    data: TUserUpdateData,
  ): Promise<TSafeUserWithRoles> {
    return await this.UserModel.updateById(id, data);
  }

  async updateUserStatus(
    ids: number[],
    status: Status,
  ): Promise<{ count: number }> {
    return await this.UserModel.updateStatusByIds(ids, status);
  }

  async updateUsers(
    ids: number[],
    userData: Partial<TSafeUser>,
  ): Promise<{ count: number }> {
    const whereInputNot = Object.entries(userData).map(([key, value]) => ({
      [key]: { not: value },
    }));
    return await this.UserModel.updateByIds(ids, userData, whereInputNot);
  }

  async deleteUsers(ids: number[]): Promise<{ count: number }> {
    return await this.UserModel.deleteByIds(ids);
  }

  async getEmailAdmins(): Promise<{ email: string }[]> {
    return await this.UserModel.getEmailAdmins();
  }
}
