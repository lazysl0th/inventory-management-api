import { USER_SELECT } from "../../../constants/selects.js";
import { container } from "tsyringe";
import Prisma from "#/infrastructure/persistence/prisma/prisma.js";
import type { Status } from "#/infrastructure/persistence/prisma/generated/enums.js";
import type { UserWhereInput } from "#/infrastructure/persistence/prisma/generated/models.js";
import type { BatchPayload } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";
import type {
  IUserRepository,
  TSafeUserSelect,
  TSafeUserWithRoles,
  TUserBySafeMode,
  TUserCreateData,
  TUserUpdateData,
} from "#/application/user/dtos/IUserRepository.js";

export default class PrismaUserRepository implements IUserRepository {
  prisma: Prisma;
  private userSelect = USER_SELECT;
  constructor(/*@inject(Prisma) private readonly prisma: Prisma*/) {
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

  async create(data: TUserCreateData): Promise<TSafeUserWithRoles> {
    return await this.prisma.client.user.create({
      data,
      select: this.userSelectSafe,
    });
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
    id: string,
    safeMode: T = true as T,
  ): Promise<TUserBySafeMode<T> | null> {
    return (await this.prisma.client.user.findUnique({
      where: { id },
      ...(safeMode
        ? { select: this.userSelectSafe }
        : { select: this.userSelect }),
    })) as TUserBySafeMode<T> | null;
  }

  async getEmailAdmins(): Promise<{ email: string }[]> {
    return await this.prisma.client.user.findMany({
      where: { roles: { some: { role: { name: "Admin" } } } },
      select: {
        email: true,
      },
    });
  }

  async updateById(
    id: string,
    data: TUserUpdateData,
  ): Promise<TSafeUserWithRoles> {
    return this.prisma.client.user.update({
      where: { id },
      data,
      select: this.userSelectSafe,
    });
  }

  async updateStatusByIds(
    ids: string[],
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
    ids: string[],
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

  async deleteByIds(ids: string[]): Promise<BatchPayload> {
    return await this.prisma.client.user.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
