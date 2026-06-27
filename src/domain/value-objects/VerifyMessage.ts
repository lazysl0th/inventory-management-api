import { EmailMessage } from "./EmailMessge.js";

export default class VerifyMessage extends EmailMessage {
  type: string = "VERIFY_USER";
  constructor(
    recipientEmail: string,
    recipientName: string,
    private readonly token: string,
    private readonly frontendUrl: string,
    senderName: string,
    senderEmail: string,
  ) {
    super(recipientEmail, recipientName, senderName, senderEmail);
  }
  get url(): string {
    return `${this.frontendUrl}${this.type}${[this.type]}?token=${this.token}`;
  }

  get subject() {
    return `Verify your account ${this.recipientName}`;
  }

  get text(): string {
    return `Hello, ${this.recipientName}! Please verify your email: ${this.url}`;
  }

  get bodyHtml(): string {
    return `<h2>Hello, ${this.recipientName}!</h2>
<p>You’ve registered at User Manager.</p>
<p>To verify your account, click the link below:</p>
<p><a href="${this.url}">${this.url}</a></p>
<p>If you didn’t register — please ignore this message.</p>`;
  }
}
