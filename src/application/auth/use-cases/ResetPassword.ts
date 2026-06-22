import { inject, injectable } from "tsyringe";
import type { TResetPasswordBodyDto } from "../dtos/AuthDto.js";
import type { IAuthRepository } from "../interfaces/IAuthRepository.js";
import type { TTokenGenerateService } from "#/application/token/interfaces/ITokenService.js";
import {
  CONFIG_TOKEN,
  type TJwtExpiresConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import type { IEmailService } from "#/application/email/interfaces/IEmailService.js";
import ResetPasswordUserMessage from "../../../services/messages/ResetPasswordUser.js";

@injectable()
export default class ResetPassword {
  constructor(
    @inject("AuthRepository")
    private readonly authRepository: IAuthRepository,
    @inject("TokenService")
    private readonly tokenGenerateService: TTokenGenerateService,
    @inject("EmailService")
    private readonly EmailService: IEmailService,
    @inject(ResetPasswordUserMessage)
    private readonly resetPasswordMessage: ResetPasswordUserMessage,

    @inject(CONFIG_TOKEN) private readonly config: TJwtExpiresConfig,
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

    await this.authRepository.saveUser(user);

    await this.EmailService.sendMessage(
      user.email,
      ResetPasswordUserMessage.getContent({
        html: {
          userName: user.name,
          url: this.resetPasswordMessage.getUrl(resetPasswordToken),
        },
        text: {
          userName: user.name,
          url: this.resetPasswordMessage.getUrl(resetPasswordToken),
        },
      }),
    );
  }
}
