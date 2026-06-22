import { inject, injectable } from "tsyringe";
import type { TTokenVerifyService } from "#/application/token/interfaces/ITokenService.js";
import {
  CONFIG_TOKEN,
  type TJwtExpiresConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import type { IAuthRepository } from "../interfaces/IAuthRepository.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import { jwtRefreshPayloadSchema } from "../dtos/AuthDto.js";

@injectable()
export default class Logout {
  constructor(
    @inject("AuthRepository")
    private readonly authRepository: IAuthRepository,
    @inject("TokenService")
    private readonly tokenVerifyService: TTokenVerifyService,
    @inject(CONFIG_TOKEN) private readonly config: TJwtExpiresConfig,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const tokenInfo = this.tokenVerifyService.verify(refreshToken);
    const jwtRefreshPayload = jwtRefreshPayloadSchema.parse(tokenInfo);
    const user = await this.authRepository.getUserById(
      jwtRefreshPayload.userId,
    );
    if (!user) throw new NotFoundError("User");
    user.setRefreshToken(null);
    await this.authRepository.saveUser(user);
  }
}
