import { inject, injectable } from "tsyringe";
import type { IAuthRepository } from "../interfaces/IAuthRepository.js";
import type { TTokenGenerateService } from "#/application/token/interfaces/ITokenService.js";
import User from "#/domain/entities/User.js";
import type { IAuthResult, TSocialLoginBodyDto } from "../dtos/AuthDto.js";
import type IIdService from "#/application/IdService/interfaces/IIdService.js";
import { SocialAccount } from "#/domain/entities/SocialAccount.js";
import {
  CONFIG_TOKEN,
  type TJwtExpiresConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import type { IUserRepository } from "#/application/user/interfaces/IUserRepository.js";

@injectable()
export default class LoginWithOAuth {
  constructor(
    @inject("AuthRepository") private readonly authRepository: IAuthRepository,
    @inject("UserRepository") private readonly userRepository: IUserRepository,
    @inject("TokenService")
    private readonly tokenGenerateService: TTokenGenerateService,
    @inject("IdService") private readonly idService: IIdService,
    @inject(CONFIG_TOKEN) private readonly config: TJwtExpiresConfig,
  ) {}

  async execute(authData: TSocialLoginBodyDto): Promise<IAuthResult> {
    let user = await this.authRepository.getUserBySocialId(
      authData.provider,
      authData.providerId,
    );
    if (!user) {
      user = await this.authRepository.getUserByEmail(authData.email);
      if (user) {
        const socialAccount = new SocialAccount({
          id: this.idService.generate(),
          provider: authData.provider,
          providerId: authData.providerId,
        });
        user.linkSocialAccount(socialAccount);
      } else {
        user = User.create({
          email: authData.email,
          name: authData.name,
        });
        const socialAccount = new SocialAccount({
          id: this.idService.generate(),
          provider: authData.provider,
          providerId: authData.providerId,
        });
        user.linkSocialAccount(socialAccount);
      }
    }
    user.changeName(authData.name);

    const accessToken = this.tokenGenerateService.generate(
      { userId: user.id, type: "access" },
      { expiresIn: this.config.ACCESS_TOKEN_EXPIRES },
    );
    const refreshToken = this.tokenGenerateService.generate(
      { userId: user.id, type: "refresh" },
      { expiresIn: this.config.REFRESH_TOKEN_EXPIRES },
    );

    user.setRefreshToken(refreshToken);
    await this.userRepository.saveUser(user);

    return { user, authTokens: { accessToken, refreshToken } };
  }
}
