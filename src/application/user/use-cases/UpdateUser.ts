import { inject, injectable } from "tsyringe";
import type { TUpdateUserDto } from "../dtos/UserDto.js";
import type { IUserRepository } from "../interfaces/IUserRepository.js";
import type User from "#/domain/entities/User.js";

@injectable()
export default class UpdateUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute({ userId, ...userData }: TUpdateUserDto): Promise<User> {
    return await this.userRepository.updateById(userId, userData);
  }
}
