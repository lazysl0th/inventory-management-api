import { inject, injectable } from "tsyringe";
import type { TUpdateUserDto } from "../dtos/UserDto.js";
import type { IUserRepository } from "../interfaces/IUserRepository.js";
import type User from "#/domain/entities/User.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";

@injectable()
export default class UpdateUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute({ userId, ...userData }: TUpdateUserDto): Promise<User> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundError("User");
    user.changeEmail(userData.email);
    user.changeName(userData.name);
    return await this.userRepository.saveUser(user);
  }
}
