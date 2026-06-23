import { inject, injectable } from "tsyringe";
import type { TGetUsersQueryDto } from "../dtos/UserDto.js";
import type {
  IUserRepository,
  TSafeUserWithRoles,
} from "../interfaces/IUserRepository.js";

@injectable()
export default class GetUsers {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: TGetUsersQueryDto): Promise<TSafeUserWithRoles[]> {
    return await this.userRepository.getAll(query.query);
  }
}
