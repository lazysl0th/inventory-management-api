import { inject, injectable } from "tsyringe";
import type { TGetUserParamsDto } from "../dtos/UserDto.js";
import type {
  IUserRepository,
  TSafeUserWithRoles,
} from "../interfaces/IUserRepository.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";

@injectable()
export default class GetUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: TGetUserParamsDto): Promise<TSafeUserWithRoles> {
    const user = await this.userRepository.getById(params.userId, true);
    if (!user) throw new NotFoundError("User");
    return user;
  }
}
