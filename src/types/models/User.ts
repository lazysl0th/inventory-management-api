import type { TProvider } from "../services/Auth.js";
import type { Settings } from "../settings.js";
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

export interface IUserModel {
  userSelectSafe: TSafeUserSelect;
  getAll(query?: string): Promise<TSafeUserWithRoles[]>;
  getById<T extends boolean = true>(
    id: number,
    safeMode?: T,
  ): Promise<TUserBySafeMode<T> | null>;
  getByEmail(email: string): Promise<TUserWithRoles | null>;
  getBySocialId(
    provider: TProvider,
    socialId: string,
  ): Promise<TSafeUserWithRoles | null>;
  getEmailAdmins(): Promise<{ email: string }[]>;
  create(data: TUserCreateData): Promise<TSafeUserWithRoles>;
  updateById(id: number, data: TUserUpdateData): Promise<TSafeUserWithRoles>;
  updateStatusByIds(ids: number[], status: Status): Promise<{ count: number }>;
  updateByIds(
    ids: number[],
    data: Partial<TSafeUserWithRoles>,
    whereNot: UserWhereInput[],
  ): Promise<{ count: number }>;
  deleteByIds(ids: number[]): Promise<{ count: number }>;
}
