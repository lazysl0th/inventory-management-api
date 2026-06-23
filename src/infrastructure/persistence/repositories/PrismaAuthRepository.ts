import type { IAuthRepository } from "#/application/auth/interfaces/IAuthRepository.js";
import { inject, injectable } from "tsyringe";
import Prisma from "../prisma/prisma.js";
import User from "#/domain/entities/User.js";
import type { UserGetPayload } from "../prisma/generated/models.js";
import type { TSocialProvider } from "#/application/auth/dtos/AuthDto.js";

type TUser = UserGetPayload<true>;

@injectable()
export default class PrismaAuthRepository implements IAuthRepository {
  constructor(@inject(Prisma) private readonly prisma: Prisma) {}

  createUser(userData: TUser): User {
    return User.restore({ ...userData, passwordHash: userData.password });
  }

  /*async saveUser(user: User): Promise<void> {
    await this.prisma.client.user.upsert({
      where: { id: user.id },
      create: user.toPersistence(),
      update: user.toPersistence(),
    });
  }*/

  async getUserByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.client.user.findUnique({
      where: { email },
    });
    return userData ? this.createUser(userData) : null;
  }

  async getUserBySocialId(
    provider: TSocialProvider,
    providerId: string,
  ): Promise<User | null> {
    const whereCondition = {
      google: { google: providerId },
      facebook: { facebook: providerId },
    }[provider];
    const userData = await this.prisma.client.user.findUnique({
      where: whereCondition,
    });
    return userData ? this.createUser(userData) : null;
  }
  /*
  async getUserById(id: string): Promise<User | null> {
    const userData = await this.prisma.client.user.findUnique({
      where: { id },
    });
    return userData ? this.createUser(userData) : null;
  }*/
}
