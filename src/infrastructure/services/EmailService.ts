import { google, type gmail_v1, type Auth } from "googleapis";
import { inject, injectable } from "tsyringe";
import type {
  IEmailService,
  IEmailServiceOptions,
} from "#/application/services/email/interfaces/IEmailService.js";
import {
  CONFIG_TOKEN,
  type TGoogleConfig,
} from "#/application/configuration/interfaces/IConfig.js";

@injectable()
export default class EmailService implements IEmailService {
  private readonly oAuth2Client: Auth.OAuth2Client;
  private readonly options: IEmailServiceOptions;

  constructor(@inject(CONFIG_TOKEN) private readonly config: TGoogleConfig) {
    this.options = {
      clientID: this.config.GOOGLE_CLIENT_ID,
      clientSecret: this.config.GOOGLE_CLIENT_SECRET,
      redirectURL: this.config.GOOGLE_REDIRECT_URL,
      refreshToken: this.config.GOOGLE_REFRESH_TOKEN,
    };
    this.oAuth2Client = new google.auth.OAuth2(
      this.options.clientID,
      this.options.clientSecret,
      this.options.redirectURL,
    );
    this.oAuth2Client.setCredentials({
      refresh_token: this.options.refreshToken,
    });
  }

  private get gmail(): gmail_v1.Gmail {
    return google.gmail({ version: "v1", auth: this.oAuth2Client });
  }

  async sendMessage(content: string): Promise<gmail_v1.Schema$Message> {
    const encodedMessage = Buffer.from([content].join("\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const msg = await this.gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });
    return msg.data;
  }
}
