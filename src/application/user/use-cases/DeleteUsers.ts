import { inject, injectable } from "tsyringe";
import type { TDeleteUsersBodyDto } from "../dtos/UserDto.js";
import type { IUserRepository } from "../interfaces/IUserRepository.js";

@injectable()
export default class DeleteUsers {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(usersData: TDeleteUsersBodyDto): Promise<{ count: number }> {
    return await this.userRepository.deleteByIds(usersData.userIds);
  }
}
