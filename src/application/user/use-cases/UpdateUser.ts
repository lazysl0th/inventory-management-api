import { inject, injectable } from "tsyringe";
import type { TUpdateUserDto } from "../dtos/UserDto.js";
import type {
  IUserRepository,
  TSafeUserWithRoles,
} from "../interfaces/IUserRepository.js";

@injectable()
export default class UpdateUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
    ...userData
  }: TUpdateUserDto): Promise<TSafeUserWithRoles> {
    return await this.userRepository.updateById(userId, userData);
  }
}
