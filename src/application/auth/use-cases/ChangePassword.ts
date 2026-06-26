import { inject, injectable } from "tsyringe";
import {
  jwtResetPasswordPayloadSchema,
  type TChangePasswordBodyDto,
} from "../dtos/AuthDto.js";
import type { TTokenVerifyService } from "#/application/services/token/interfaces/ITokenService.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import LocalCredentials from "#/domain/value-objects/LocalCredentials.js";
import type { THashGeneratorService } from "#/application/services/hash/interfaces/IHashService.js";
import type { IUserRepository } from "#/application/user/interfaces/IUserRepository.js";

@injectable()
export default class ChangePassword {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @inject("HashService")
    private readonly hashGeneratorService: THashGeneratorService,
    @inject("TokenService")
    private readonly tokenVerifyService: TTokenVerifyService,
  ) {}

  async execute(changePasswordData: TChangePasswordBodyDto): Promise<void> {
    const tokenInfo = this.tokenVerifyService.verify(changePasswordData.token);
    const jwtResetPasswordPayload =
      jwtResetPasswordPayloadSchema.parse(tokenInfo);
    const user = await this.userRepository.getById(
      jwtResetPasswordPayload.userId,
    );
    if (!user) throw new NotFoundError("User");
    const localCredentials = await LocalCredentials.create({
      password: changePasswordData.password,
      hashGenerateService: this.hashGeneratorService,
    });

    user.setLocalCredentials(localCredentials);
    await this.userRepository.saveUser(user);
  }
}
