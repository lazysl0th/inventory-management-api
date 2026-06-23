import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "../interfaces/IUserRepository.js";
import type { Status } from "#/infrastructure/persistence/prisma/generated/enums.js";

@injectable()
export default class UpdateUsersStatus {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(ids: string[], status: Status): Promise<{ count: number }> {
    return await this.userRepository.updateStatusByIds(ids, status);
  }
}
