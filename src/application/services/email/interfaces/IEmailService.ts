import type { gmail_v1 } from "googleapis";

export interface IEmailService {
  sendMessage(content: string): Promise<gmail_v1.Schema$Message>;
}

export interface IEmailServiceOptions {
  clientID: string;
  clientSecret: string;
  redirectURL: string;
  refreshToken: string;
}
