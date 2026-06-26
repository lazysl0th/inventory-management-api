import { inject, injectable } from "tsyringe";
import type { TTokenVerifyService } from "#/application/services/token/interfaces/ITokenService.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import { jwtRefreshPayloadSchema } from "../dtos/AuthDto.js";
import type { IUserRepository } from "#/application/user/interfaces/IUserRepository.js";

@injectable()
export default class Logout {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @inject("TokenService")
    private readonly tokenVerifyService: TTokenVerifyService,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const tokenInfo = this.tokenVerifyService.verify(refreshToken);
    const jwtRefreshPayload = jwtRefreshPayloadSchema.parse(tokenInfo);
    const user = await this.userRepository.getById(jwtRefreshPayload.userId);
    if (!user) throw new NotFoundError("User");
    user.setRefreshToken(null);
    await this.userRepository.saveUser(user);
  }
}
