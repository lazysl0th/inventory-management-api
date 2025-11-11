import { google } from "googleapis";
import config from '../../config.js';

const {
  GOOGLE_CLIENT_ID_GMAIL,
  GOOGLE_CLIENT_SECRET_GMAIL,
  GOOGLE_REFRESH_TOKEN_GMAIL,
  BACKEND,
  FRONTEND
} = config

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID_GMAIL,
  GOOGLE_CLIENT_SECRET_GMAIL,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: GOOGLE_REFRESH_TOKEN_GMAIL,
});

export const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

export const urls = {
  verifyUser: (token) => (`${BACKEND}/verifyuser?token=${token}`),
  resetPass: (token) => (`${FRONTEND}/change-password?token=${token}`),
}