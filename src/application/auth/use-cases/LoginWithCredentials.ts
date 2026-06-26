import { inject, injectable } from "tsyringe";
import type { TAuthTokens, TLocalLoginBodyDto } from "../dtos/AuthDto.js";
import type { THashComparerService } from "#/application/services/hash/interfaces/IHashService.js";
import type { TTokenGenerateService } from "#/application/services/token/interfaces/ITokenService.js";
import {
  CONFIG_TOKEN,
  type TJwtExpiresConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import type { IAuthRepository } from "../interfaces/IAuthRepository.js";
import InvalidCredentialsError from "#/domain/errors/InvalidCredentialsError.js";
import type { IUserRepository } from "#/application/user/interfaces/IUserRepository.js";

@injectable()
export default class LoginWithCredentials {
  constructor(
    @inject("AuthRepository")
    private readonly authRepository: IAuthRepository,
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @inject("HashService")
    private readonly hashComparerService: THashComparerService,
    @inject("TokenService")
    private readonly tokenGenerateService: TTokenGenerateService,
    @inject(CONFIG_TOKEN) private readonly config: TJwtExpiresConfig,
  ) {}

  async execute(authData: TLocalLoginBodyDto): Promise<TAuthTokens> {
    const user = await this.authRepository.getUserByEmail(authData.email);
    if (!user || !user?.localCredentials?.passwordHash)
      throw new InvalidCredentialsError();

    if (
      !(await user.localCredentials.comparePassword(
        authData.password,
        this.hashComparerService,
      ))
    )
      throw new InvalidCredentialsError();

    const accessToken = this.tokenGenerateService.generate(
      {
        userId: user.id,
        type: "access",
      },
      {
        expiresIn: this.config.ACCESS_TOKEN_EXPIRES,
      },
    );
    const refreshToken = this.tokenGenerateService.generate(
      {
        userId: user.id,
        type: "refresh",
      },
      {
        expiresIn: authData.remember
          ? this.config.REMEMBER_REFRESH_TOKEN_EXPIRES
          : this.config.REFRESH_TOKEN_EXPIRES,
      },
    );

    user.setRefreshToken(refreshToken);

    await this.userRepository.saveUser(user);

    return { accessToken, refreshToken };
  }
}
