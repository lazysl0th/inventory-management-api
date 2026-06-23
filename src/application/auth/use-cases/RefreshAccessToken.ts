import { inject, injectable } from "tsyringe";
import { jwtRefreshPayloadSchema } from "../dtos/AuthDto.js";
import type {
  TTokenGenerateService,
  TTokenVerifyService,
} from "#/application/token/interfaces/ITokenService.js";
import {
  CONFIG_TOKEN,
  type TJwtExpiresConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import ForbiddenError from "#/domain/errors/ForbiddenError.js";
import type { IUserRepository } from "#/application/user/interfaces/IUserRepository.js";

@injectable()
export default class RefreshAccessToken {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @inject("TokenService")
    private readonly tokenGenerateService: TTokenGenerateService,
    @inject("TokenService")
    private readonly tokenVerifyService: TTokenVerifyService,
    @inject(CONFIG_TOKEN) private readonly config: TJwtExpiresConfig,
  ) {}

  async execute(refreshToken: string): Promise<string> {
    const tokenInfo = this.tokenVerifyService.verify(refreshToken);
    const jwtRefreshPayload = jwtRefreshPayloadSchema.parse(tokenInfo);
    const user = await this.userRepository.getById(jwtRefreshPayload.userId);
    if (!user) throw new NotFoundError("User");
    if (user.equialRefreshToken(refreshToken)) throw new ForbiddenError();
    return this.tokenGenerateService.generate(
      {
        userId: user.id,
        type: "access",
      },
      {
        expiresIn: this.config.ACCESS_TOKEN_EXPIRES,
      },
    );
  }
}
