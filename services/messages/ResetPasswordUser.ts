import MessageContent from "../../base/MessageContent.js";
import { FRONTEND_URL } from "../../constants/base.js";
import type { MessageType } from "../../types/base/MessageContent.js";

export default class ResetPasswordUserMessage extends MessageContent {
  static readonly type: MessageType = 'RESET_PASSWORD_USER';

  static getUrl(token: string): string {
    return `${FRONTEND_URL}${this.type}?resetPasswordToken=${token}`;
  }
}