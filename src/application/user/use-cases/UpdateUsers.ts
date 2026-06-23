import { inject, injectable } from "tsyringe";
import type { TUpdateUsersBodyDto } from "../dtos/UserDto.js";
import type { IUserRepository } from "../interfaces/IUserRepository.js";

@injectable()
export default class UpdateUsers {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(usersData: TUpdateUsersBodyDto): Promise<{ count: number }> {
    const whereInputNot = Object.entries(usersData.data).map(
      ([key, value]) => ({
        [key]: { not: value },
      }),
    );
    return await this.userRepository.updateByIds(
      usersData.ids,
      usersData.data,
      whereInputNot,
    );
  }
}
