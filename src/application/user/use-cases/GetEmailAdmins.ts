import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "../interfaces/IUserRepository.js";

@injectable()
export default class GetEmailAdmins {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<{ email: string }[]> {
    return await this.userRepository.getEmailAdmins();
  }
}
