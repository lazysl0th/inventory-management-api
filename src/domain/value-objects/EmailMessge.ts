export abstract class EmailMessage {
  constructor(
    protected readonly recipientEmail: string,
    protected readonly recipientName: string,
    protected readonly senderName: string,
    protected readonly senderEmail: string,
  ) {}

  abstract get subject(): string;
  abstract get bodyHtml(): string;
  abstract get text(): string;

  get html(): string {
    const body = this.bodyHtml;
    const subject = this.subject;
    const text = this.text;

    return `From: ${this.senderName} <${this.senderEmail}>
To: ${this.recipientEmail}
Subject: ${subject}
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="boundary123"

--boundary123
Content-Type: text/plain; charset=utf-8

${text}

--boundary123
Content-Type: text/html; charset=utf-8

${body}

--boundary123--`;
  }
}
