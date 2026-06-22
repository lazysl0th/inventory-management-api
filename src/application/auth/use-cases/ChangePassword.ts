import { inject, injectable } from "tsyringe";
import {
  jwtResetPasswordPayloadSchema,
  type TChangePasswordBodyDto,
} from "../dtos/AuthDto.js";
import type { TTokenVerifyService } from "#/application/token/interfaces/ITokenService.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import LocalCredentials from "#/domain/value-objects/LocalCredentials.js";
import type { THashGeneratorService } from "#/application/hash/interfaces/IHashService.js";
import type { IAuthRepository } from "../interfaces/IAuthRepository.js";

@injectable()
export default class ChangePassword {
  constructor(
    @inject("AuthRepository")
    private readonly authRepository: IAuthRepository,
    @inject("HashService")
    private readonly hashGeneratorService: THashGeneratorService,
    @inject("TokenService")
    private readonly tokenVerifyService: TTokenVerifyService,
  ) {}

  async execute(changePasswordData: TChangePasswordBodyDto): Promise<void> {
    const tokenInfo = this.tokenVerifyService.verify(changePasswordData.token);
    const jwtResetPasswordPayload =
      jwtResetPasswordPayloadSchema.parse(tokenInfo);
    const user = await this.authRepository.getUserById(
      jwtResetPasswordPayload.userId,
    );
    if (!user) throw new NotFoundError("User");
    const localCredentials = await LocalCredentials.create({
      password: changePasswordData.password,
      hashGenerateService: this.hashGeneratorService,
    });

    user.setLocalCredentials(localCredentials);
    await this.authRepository.saveUser(user);
  }
}
