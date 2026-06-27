import { EmailMessage } from "./EmailMessge.js";

export default class ResetPasswordMessage extends EmailMessage {
  type: string = "RESET_PASSWORD_USER";
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
    return `${this.frontendUrl}${this.type}?resetPasswordToken=${this.token}`;
  }

  get subject() {
    return "Reset Your Password";
  }

  get text(): string {
    return `Hello ${this.recipientName},
You requested to reset your password.
Click the link below to set a new password:
${this.url}
If you didn’t request this, ignore this email.
Thanks, Your App Team`;
  }

  get bodyHtml(): string {
    return `<p>Hello ${this.recipientName},</p>
<p>You requested to reset your password.</p>
<p>Click the link below to set a new password:</p>
<p><a href="${this.url}">${this.url}</a></p>
<p>If you didn’t request this, ignore this email.</p>
<p>Thanks,<br>Your App Team</p>`;
  }
}
