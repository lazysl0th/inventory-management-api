import Model from "../base/Model.js";
import type {
  IUserModel,
  TSafeUserSelect,
  TSafeUserWithRoles,
  TUserBySafeMode,
  TUserCreateData,
  TUserUpdateData,
  TUserWithRoles,
} from "../types/models/User.js";
import type { TProvider } from "../types/services/Auth.js";
import { USER_SELECT } from "../constants/selects.js";
import { container } from "tsyringe";
import Prisma from "#/infrastructure/persistence/prisma/prisma.js";
import type { Status } from "#/infrastructure/persistence/prisma/generated/enums.js";
import type {
  UserWhereInput,
  UserWhereUniqueInput,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import type { BatchPayload } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";

export default class UserModel
  extends Model<TSafeUserWithRoles, TUserCreateData, TUserUpdateData>
  implements IUserModel
{
  prisma: Prisma;
  private userSelect = USER_SELECT;
  constructor(/*@inject(Prisma) private readonly prisma: Prisma*/) {
    super();
    this.prisma = container.resolve(Prisma);
  }

  get userSelectSafe(): TSafeUserSelect {
    const {
      password,
      resetPasswordToken,
      refreshToken,
      createdAt,
      ...safeUserSelect
    } = this.userSelect;
    void password;
    void resetPasswordToken;
    void refreshToken;
    void createdAt;
    return safeUserSelect;
  }

  async getAll(query?: string): Promise<TSafeUserWithRoles[]> {
    return await this.prisma.client.user.findMany({
      ...(query && {
        where: { email: { contains: query, mode: "insensitive" } },
      }),
      select: this.userSelectSafe,
    });
  }

  async getById<T extends boolean = true>(
    id: number,
    safeMode: T = true as T,
  ): Promise<TUserBySafeMode<T> | null> {
    return (await this.prisma.client.user.findUnique({
      where: { id },
      ...(safeMode
        ? { select: this.userSelectSafe }
        : { select: this.userSelect }),
    })) as TUserBySafeMode<T> | null;
  }

  async getByEmail(email: string): Promise<TUserWithRoles | null> {
    return await this.prisma.client.user.findUnique({
      where: { email },
      select: this.userSelect,
    });
  }

  async getBySocialId(
    provider: TProvider,
    socialId: string,
  ): Promise<TSafeUserWithRoles | null> {
    return await this.prisma.client.user.findUnique({
      where: { [provider]: socialId } as unknown as UserWhereUniqueInput,
      select: this.userSelectSafe,
    });
  }

  async getEmailAdmins(): Promise<{ email: string }[]> {
    return await this.prisma.client.user.findMany({
      where: { roles: { some: { role: { name: "Admin" } } } },
      select: {
        email: true,
      },
    });
  }

  async create(data: TUserCreateData): Promise<TSafeUserWithRoles> {
    return await this.prisma.client.user.create({
      data,
      select: this.userSelectSafe,
    });
  }

  async updateById(
    id: number,
    data: TUserUpdateData,
  ): Promise<TSafeUserWithRoles> {
    return this.prisma.client.user.update({
      where: { id },
      data,
      select: this.userSelectSafe,
    });
  }

  async updateStatusByIds(
    ids: number[],
    status: Status,
  ): Promise<BatchPayload> {
    return await this.prisma.client.user.updateMany({
      where: {
        id: { in: ids },
        status: { not: status },
      },
      data: { status },
    });
  }

  async updateByIds(
    ids: number[],
    data: Partial<TSafeUserWithRoles>,
    whereNot: UserWhereInput[],
  ): Promise<{ count: number }> {
    return await this.prisma.client.user.updateMany({
      where: {
        id: { in: ids },
        AND: whereNot,
      },
      data,
    });
  }

  async updatePasswordByToken(
    token: string,
    hash: string,
  ): Promise<BatchPayload> {
    return await this.prisma.client.user.updateMany({
      where: { resetPasswordToken: token },
      data: {
        password: hash,
        resetPasswordToken: "",
      },
    });
  }

  async deleteByIds(ids: number[]): Promise<BatchPayload> {
    return await this.prisma.client.user.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
