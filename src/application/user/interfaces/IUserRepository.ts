import type {
  UserCreateInput,
  UserGetPayload,
  UserUpdateInput,
  UserWhereInput,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import type { Status } from "#/infrastructure/persistence/prisma/generated/enums.js";
import type User from "#/domain/entities/User.js";

export type TUserWithRoles = UserGetPayload<{
  include: {
    roles: true;
  };
}>;

export type TUserCreateData = UserCreateInput;

export type TUserUpdateData = UserUpdateInput;

export type TSafeUserWithRoles = Omit<
  TUserWithRoles,
  "password" | "resetPasswordToken" | "refreshToken" | "createdAt"
>;

export interface IUserRepository {
  getAll(query?: string): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  updateById(id: string, data: TUserUpdateData): Promise<User>;
  updateByIds(
    ids: string[],
    data: Partial<TSafeUserWithRoles>,
    whereNot: UserWhereInput[],
  ): Promise<{ count: number }>;
  deleteByIds(ids: string[]): Promise<{ count: number }>;
  updateStatusByIds(ids: string[], status: Status): Promise<{ count: number }>;
  getEmailAdmins(): Promise<{ email: string }[]>;
}
