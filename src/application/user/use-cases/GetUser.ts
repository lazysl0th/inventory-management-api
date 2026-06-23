import { inject, injectable } from "tsyringe";
import type { TGetUserParamsDto } from "../dtos/UserDto.js";
import type { IUserRepository } from "../interfaces/IUserRepository.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import type User from "#/domain/entities/User.js";

@injectable()
export default class GetUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: TGetUserParamsDto): Promise<User> {
    const user = await this.userRepository.getById(params.userId);
    if (!user) throw new NotFoundError("User");
    return user;
  }
}
