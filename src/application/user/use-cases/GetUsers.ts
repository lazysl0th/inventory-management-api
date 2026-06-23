import { inject, injectable } from "tsyringe";
import type { TGetUsersQueryDto } from "../dtos/UserDto.js";
import type { IUserRepository } from "../interfaces/IUserRepository.js";
import type User from "#/domain/entities/User.js";

@injectable()
export default class GetUsers {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: TGetUsersQueryDto): Promise<User[]> {
    return await this.userRepository.getAll(query.searchQuery);
  }
}
