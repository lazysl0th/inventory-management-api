import type { Settings } from "../../../types/settings.js";
import type {
  UserCreateInput,
  UserGetPayload,
  UserUpdateInput,
  UserWhereInput,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import type { Status } from "#/infrastructure/persistence/prisma/generated/enums.js";

export type TUser = UserGetPayload<{
  select: Omit<Settings["selects"]["user"], "roles">;
}>;

export type TUserWithRoles = UserGetPayload<{
  select: Settings["selects"]["user"];
}>;

export type TSafeUser = UserGetPayload<{
  select: Omit<
    Settings["selects"]["user"],
    "roles" | "password" | "resetPasswordToken" | "refreshToken" | "createdAt"
  >;
}>;

export type TUserCreateData = UserCreateInput;

export type TUserUpdateData = UserUpdateInput;

export type TSafeUserSelect = Omit<
  Settings["selects"]["user"],
  "password" | "resetPasswordToken" | "refreshToken" | "createdAt"
>;

export type TSafeUserWithRoles = Omit<
  TUserWithRoles,
  "password" | "resetPasswordToken" | "refreshToken" | "createdAt"
>;

export type TUserBySafeMode<T extends boolean> = T extends true
  ? TSafeUserWithRoles
  : TUserWithRoles;

export interface IUserRepository {
  userSelectSafe: TSafeUserSelect;
  getAll(query?: string): Promise<TSafeUserWithRoles[]>;
  getById<T extends boolean = true>(
    id: string,
    safeMode?: T,
  ): Promise<TUserBySafeMode<T> | null>;
  getEmailAdmins(): Promise<{ email: string }[]>;
  create(data: TUserCreateData): Promise<TSafeUserWithRoles>;
  updateById(id: string, data: TUserUpdateData): Promise<TSafeUserWithRoles>;
  updateStatusByIds(ids: string[], status: Status): Promise<{ count: number }>;
  updateByIds(
    ids: string[],
    data: Partial<TSafeUserWithRoles>,
    whereNot: UserWhereInput[],
  ): Promise<{ count: number }>;
  deleteByIds(ids: string[]): Promise<{ count: number }>;
}
