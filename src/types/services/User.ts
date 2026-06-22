import type {
  TSafeUser,
  TSafeUserWithRoles,
  TUserBySafeMode,
  TUserCreateData,
  TUserUpdateData,
} from "#/application/user/dtos/IUserRepository.js";
import type { Status } from "#/infrastructure/persistence/prisma/generated/enums.js";

export interface IUserService {
  getUserById<T extends boolean = true>(
    id: string,
    safeMode?: T,
  ): Promise<TUserBySafeMode<T>>;
  getUsers(query?: string): Promise<TSafeUserWithRoles[]>;
  createUser(data: TUserCreateData): Promise<TSafeUserWithRoles>;
  updateUser(id: string, data: TUserUpdateData): Promise<TSafeUserWithRoles>;
  updateUserStatus(ids: string[], status: Status): Promise<{ count: number }>;
  updateUsers(
    ids: string[],
    userData: Partial<TSafeUser>,
  ): Promise<{ count: number }>;
  deleteUsers(ids: string[]): Promise<{ count: number }>;
  getEmailAdmins(): Promise<{ email: string }[]>;
}
