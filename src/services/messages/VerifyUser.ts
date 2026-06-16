import MessageContent from "../../base/MessageContent.js";
import { FRONTEND_URL } from "../../constants/base.js";
import type { MessageType } from "../../types/base/MessageContent.js";

export default class VerifyUserMessage extends MessageContent {
  static readonly type: MessageType = "VERIFY_USER";

  static getUrl(token: string): string {
    return `${FRONTEND_URL}${[this.type]}?token=${token}`;
  }
}
