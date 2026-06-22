import { inject, injectable } from "tsyringe";
import MessageContent from "../../base/MessageContent.js";
import type { MessageType } from "../../types/base/MessageContent.js";
import {
  CONFIG_TOKEN,
  type TFrontendUrlConfig,
} from "#/application/configuration/interfaces/IConfig.js";
@injectable()
export default class ResetPasswordUserMessage extends MessageContent {
  constructor(
    @inject(CONFIG_TOKEN) private readonly config: TFrontendUrlConfig,
  ) {
    super();
  }

  readonly type: MessageType = "RESET_PASSWORD_USER";

  getUrl(token: string): string {
    return `${this.config.FRONTEND_URL}${this.type}?resetPasswordToken=${token}`;
  }
}
