import { inject, injectable } from "tsyringe";
import type { TAuthTokens, TRegisterBodyDto } from "../dtos/AuthDto.js";
import type { THashGeneratorService } from "#/application/hash/interfaces/IHashService.js";
import LocalCredentials from "#/domain/value-objects/LocalCredentials.js";
import User from "#/domain/entities/User.js";
import type { TTokenGenerateService } from "#/application/token/interfaces/ITokenService.js";
import {
  CONFIG_TOKEN,
  type TJwtExpiresConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import type IIdService from "#/application/IdService/interfaces/IIdService.js";
import type { IUserRepository } from "#/application/user/interfaces/IUserRepository.js";

@injectable()
export default class RegisterWithCredentials {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @inject("HashService")
    private readonly hashGeneratorService: THashGeneratorService,
    @inject("TokenService")
    private readonly tokenGenerateService: TTokenGenerateService,
    @inject("IdService")
    private readonly idService: IIdService,
    @inject(CONFIG_TOKEN) private readonly config: TJwtExpiresConfig,
  ) {}

  async execute(regData: TRegisterBodyDto): Promise<TAuthTokens> {
    const userId = this.idService.generate();
    const user = User.create({
      id: userId,
      email: regData.email,
      name: regData.name,
    });

    const localCredentials = await LocalCredentials.create({
      password: regData.password,
      hashGenerateService: this.hashGeneratorService,
    });

    user.setLocalCredentials(localCredentials);

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
        expiresIn: this.config.REFRESH_TOKEN_EXPIRES,
      },
    );

    user.setRefreshToken(refreshToken);

    await this.userRepository.saveUser(user);

    console.log(user);

    return { accessToken, refreshToken };
  }
}
