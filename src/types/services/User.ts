import type { Status } from "@prisma/client";
import type {
  TSafeUser,
  TSafeUserWithRoles,
  TUserBySafeMode,
  TUserCreateData,
  TUserUpdateData,
  TUserWithRoles,
} from "../models/User.js";
import type { TProvider } from "./Auth.js";

export interface IUserService {
  getUserById<T extends boolean = true>(
    id: number,
    safeMode?: T,
  ): Promise<TUserBySafeMode<T>>;
  getUserByEmail(email: string): Promise<TUserWithRoles>;
  getUserBySocialId(
    provider: TProvider,
    socialId: string,
  ): Promise<TSafeUserWithRoles | null>;
  getUsers(query?: string): Promise<TSafeUserWithRoles[]>;
  createUser(data: TUserCreateData): Promise<TSafeUserWithRoles>;
  updateUser(id: number, data: TUserUpdateData): Promise<TSafeUserWithRoles>;
  updateUserStatus(ids: number[], status: Status): Promise<{ count: number }>;
  updateUsers(
    ids: number[],
    userData: Partial<TSafeUser>,
  ): Promise<{ count: number }>;
  deleteUsers(ids: number[]): Promise<{ count: number }>;
  getEmailAdmins(): Promise<{ email: string }[]>;
}
