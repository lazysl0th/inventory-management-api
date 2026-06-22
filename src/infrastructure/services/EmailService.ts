import { google, type gmail_v1, type Auth } from "googleapis";
import type {
  IEmailService,
  IEmailServiceOptions,
} from "../../application/email/interfaces/IEmailService.js";

import { replaceParamsInTemplate } from "../../utils.js";
import type { Content } from "../../types/base/MessageContent.js";
import { MESSAGE_TEMPLATE, SENDER_NAME } from "../../constants/email.js";
import { GOOGLE } from "../../constants/integration.js";
import { injectable } from "tsyringe";

@injectable()
export default class EmailService implements IEmailService {
  private readonly oAuth2Client: Auth.OAuth2Client;
  private readonly options: IEmailServiceOptions;

  constructor() {
    this.options = {
      clientID: GOOGLE.CLIENT_ID,
      clientSecret: GOOGLE.CLIENT_SECRET,
      redirectURL: GOOGLE.REDIRECT_URL,
      refreshToken: GOOGLE.REFRESH_TOKEN,
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

  createMessage(recipient: string, content: Content) {
    const message = replaceParamsInTemplate(
      {
        senderName: SENDER_NAME,
        senderEmail: "",
        recipient: recipient,
        subject: content.subject,
        text: content.text,
        html: content.html,
      },
      MESSAGE_TEMPLATE,
    );
    return message;
  }

  async sendMessage(
    email: string,
    content: Content,
  ): Promise<gmail_v1.Schema$Message> {
    const message = this.createMessage(email, content);
    const encodedMessage = Buffer.from([message].join("\n"))
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
