import 'dotenv/config';

const {
    NODE_ENV,
    SENDER,
} = process.env;

export const SENDER_NAME = NODE_ENV === 'production' && SENDER ? SENDER : 'Inventory management'

export const MESSAGE_TEMPLATE = `From: {senderName} <{senderEmail}>
To: {recipient}
Subject: {subject}
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="boundary123"

--boundary123
Content-Type: text/plain; charset=utf-8

{text}

--boundary123
Content-Type: text/html; charset=utf-8

{html}

--boundary123--`

export const CONTENT_TAMPLATES ={
    VERIFY_USER: {
        SUBJECT: 'Verify your account {userName}',
        HTML:
`<h2>Hello, {userName}!</h2>
<p>You’ve registered at User Manager.</p>
<p>To verify your account, click the link below:</p>
<p><a href="{url}">{url}</a></p>
<p>If you didn’t register — please ignore this message.</p>`,
        TEXT: `Hello, {userName}! Please verify your email: {url}`,
    },
    RESET_PASSWORD_USER: {
        SUBJECT: 'Reset Your Password',
        HTML:
`<p>Hello {userName},</p>
<p>You requested to reset your password.</p>
<p>Click the link below to set a new password:</p>
<p><a href="{url}">{url}</a></p>
<p>If you didn’t request this, ignore this email.</p>
<p>Thanks,<br>Your App Team</p>`,
        TEXT:
`Hello {userName},
You requested to reset your password.
Click the link below to set a new password:
{url}
If you didn’t request this, ignore this email.
Thanks, Your App Team`,
    }
}