import { inject, injectable } from "tsyringe";
import Prisma from "#/infrastructure/persistence/prisma/prisma.js";
import type { Status } from "#/infrastructure/persistence/prisma/generated/enums.js";
import type {
  UserGetPayload,
  UserWhereInput,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import type { BatchPayload } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";
import type {
  IUserRepository,
  TSafeUserWithRoles,
  TUserUpdateData,
} from "#/application/user/interfaces/IUserRepository.js";
import User from "#/domain/entities/User.js";

type TUser = UserGetPayload<{
  include: {
    roles: {
      select: {
        role: true;
      };
    };
  };
}>;

@injectable()
export default class PrismaUserRepository implements IUserRepository {
  constructor(@inject(Prisma) private readonly prisma: Prisma) {}

  private include = {
    roles: {
      select: {
        role: true,
      },
    },
  };

  createUser(userData: TUser): User {
    return User.restore(userData);
  }

  async saveUser(user: User): Promise<User> {
    const userData = await this.prisma.client.user.upsert({
      where: { id: user.id },
      create: {
        ...user.toPersistence(),
        roles: {
          create: user.roles.map((roleName) => ({
            role: {
              connectOrCreate: {
                where: { name: roleName },
                create: { name: roleName },
              },
            },
          })),
        },
      },
      update: {
        ...user.toPersistence(),
        roles: {
          deleteMany: {},
          create: user.roles.map((roleName) => ({
            role: {
              connectOrCreate: {
                where: { name: roleName },
                create: { name: roleName },
              },
            },
          })),
        },
      },
      include: this.include,
    });
    return this.createUser(userData);
  }

  async getAll(searchQuery?: string): Promise<User[]> {
    const usersData = await this.prisma.client.user.findMany({
      ...(searchQuery && {
        where: { email: { contains: searchQuery, mode: "insensitive" } },
      }),
      include: this.include,
    });
    return usersData.map(this.createUser);
  }

  async getById(id: string): Promise<User | null> {
    const userData = await this.prisma.client.user.findUnique({
      where: { id },
      include: this.include,
    });
    return userData ? this.createUser(userData) : null;
  }

  async updateById(id: string, data: TUserUpdateData): Promise<User> {
    const userData = await this.prisma.client.user.update({
      where: { id },
      data,
      include: this.include,
    });
    return this.createUser(userData);
  }

  async updateByIds(
    ids: string[],
    data: Partial<TSafeUserWithRoles>,
    whereNot: UserWhereInput[],
  ): Promise<BatchPayload> {
    return await this.prisma.client.user.updateMany({
      where: {
        id: { in: ids },
        AND: whereNot,
      },
      data,
    });
  }

  async deleteByIds(ids: string[]): Promise<BatchPayload> {
    return await this.prisma.client.user.deleteMany({
      where: { id: { in: ids } },
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
  async getEmailAdmins(): Promise<{ email: string }[]> {
    return await this.prisma.client.user.findMany({
      where: { roles: { some: { role: { name: "Admin" } } } },
      select: {
        email: true,
      },
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
}
