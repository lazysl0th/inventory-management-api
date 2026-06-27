import { inject, injectable } from "tsyringe";
import type { TResetPasswordBodyDto } from "../dtos/AuthDto.js";
import type { IAuthRepository } from "../interfaces/IAuthRepository.js";
import type { TTokenGenerateService } from "#/application/services/token/interfaces/ITokenService.js";
import {
  CONFIG_TOKEN,
  type TEmailServiceConfig,
  type TFrontendUrlConfig,
  type TJwtExpiresConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import type { IUserRepository } from "#/application/user/interfaces/IUserRepository.js";
import type { IEmailService } from "#/application/services/email/interfaces/IEmailService.js";
import ResetPasswordMessage from "#/domain/value-objects/ResetPasswordMessage.js";

@injectable()
export default class ResetPassword {
  constructor(
    @inject("AuthRepository")
    private readonly authRepository: IAuthRepository,
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @inject("TokenService")
    private readonly tokenGenerateService: TTokenGenerateService,
    @inject("EmailService")
    private readonly EmailService: IEmailService,

    @inject(CONFIG_TOKEN)
    private readonly config: TJwtExpiresConfig &
      TEmailServiceConfig &
      TFrontendUrlConfig,
  ) {}

  async execute(resetPasswordData: TResetPasswordBodyDto): Promise<void> {
    const user = await this.authRepository.getUserByEmail(
      resetPasswordData.email,
    );
    if (!user) throw new NotFoundError("User");

    const resetPasswordToken = this.tokenGenerateService.generate(
      { userId: user.id, type: "resetPassword" },
      { expiresIn: this.config.RESET_PASSWORD_TOKEN_EXPIRES },
    );

    user.setResetPasswordToken(resetPasswordToken);

    await this.userRepository.saveUser(user);

    const message = new ResetPasswordMessage(
      user.email,
      user.name,
      resetPasswordToken,
      this.config.FRONTEND_URL,
      this.config.EMAIL_SENDER_NAME,
      this.config.EMAIL_SENDER_EMAIL,
    );

    await this.EmailService.sendMessage(message.html);
  }
}
