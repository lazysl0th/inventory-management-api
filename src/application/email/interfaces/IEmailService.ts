import type { gmail_v1 } from "googleapis";
import type { Content } from "../../../types/base/MessageContent.js";

export interface IEmailService {
  sendMessage(
    email: string,
    content: Content,
  ): Promise<gmail_v1.Schema$Message>;
}

export interface IEmailServiceOptions {
  clientID: string;
  clientSecret: string;
  redirectURL: string;
  refreshToken: string;
}
