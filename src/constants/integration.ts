import "dotenv/config";

const {
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_CALLBACK_URL,
} = process.env;

const isProd = NODE_ENV === "production";

export const GOOGLE = {
  CLIENT_ID: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID : "",
  CLIENT_SECRET: GOOGLE_CLIENT_SECRET ? GOOGLE_CLIENT_SECRET : "",
  REDIRECT_URL: "https://developers.google.com/oauthplayground",
  REFRESH_TOKEN: GOOGLE_REFRESH_TOKEN ? GOOGLE_REFRESH_TOKEN : "",
  CALLBACK_URL:
    isProd && GOOGLE_CALLBACK_URL
      ? GOOGLE_CALLBACK_URL
      : "http://localhost:3001/signin/google/callback",
};
