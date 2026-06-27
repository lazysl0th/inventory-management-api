import {
  envSchema,
  NodeEnv,
  type TConfig,
} from "#/application/configuration/interfaces/IConfig.js";

const env = {
  NODE_ENV: process.env.NODE_ENV ?? NodeEnv.Development,
  PORT: process.env.PORT ?? 3001,
  SHUTDOWN_SERVER_TIMEOUT: process.env.SHUTDOWN_SERVER_TIMEOUT ?? 10000,
  DATABASE_URL:
    process.env.DATABASE_URL ??
    "postgres://lazy_sloth:secret@localhost:5432/inventory_dev?schema=public",
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:8080",
  BACKEND_URL: process.env.BACKEND_URL ?? "http://localhost:3001",
  SALT_ROUNDS: process.env.SALT_ROUNDS ?? 10,
  JWT_SECRET: process.env.JWT_SECRET ?? "JWT_SECRET_DEV",
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES ?? 900,
  RESET_PASSWORD_TOKEN_EXPIRES: process.env.RESET_PASSWORD_TOKEN_EXPIRES ?? 900,
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES ?? 172800,
  REMEMBER_REFRESH_TOKEN_EXPIRES:
    process.env.REMEMBER_REFRESH_TOKEN_EXPIRES ?? 604800,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL:
    process.env.GOOGLE_REDIRECT_URL ??
    "https://developers.google.com/oauthplayground",
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_CALLBACK_URL:
    process.env.GOOGLE_CALLBACK_URL ??
    "http://localhost:3001/signin/google/callback",
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL:
    process.env.FACEBOOK_CALLBACK_URL ??
    "http://localhost:3001/signin/facebook/callback",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_KEY,
  CLOUDINARY_UPLOAD_FOLDER:
    process.env.CLOUDINARY_UPLOAD_FOLDER ?? "inventory-images",
  SALES_FORCE_CLIENT_ID: process.env.SF_CONSUMER_KEY,
  SALES_FORCE_CLIENT_SECRET: process.env.SF_CONSUMER_SECRET,
  SALES_FORCE_BASE_URL:
    process.env.SALES_FORCE_BASE_URL ??
    "https://orgfarm-9325b65284-dev-ed.develop.my.salesforce.com/services",
  DROPBOX_GRANT_TYPE: process.env.DROPBOX_GRANT_TYPE ?? "refresh_token",
  DROPBOX_REFRESH_TOKEN: process.env.DROPBOX_REFRESH_TOKEN,
  DROPBOX_CLIENT_ID: process.env.DROPBOX_APP_KEY,
  DROPBOX_CLIENT_SECRET: process.env.DROPBOX_SECRET_KEY,
  DROPBOX_REDIRECT_URI:
    process.env.DROPBOX_CALLBACK_URL ??
    "http://localhost:3001/signin/dropbox/callback",
  DROPBOX_BASE_URL:
    process.env.DROPBOX_BASE_URL ?? "https://api.dropboxapi.com",
  DROPBOX_CONTENT_URL:
    process.env.DROPBOX_CONTENT_URL ?? "https://content.dropboxapi.com",
  EMAIL_SENDER_NAME: process.env.SENDER_NAME ?? "Inventory management",
  EMAIL_SENDER_EMAIL:
    process.env.SENDER_EMAIL ?? "inventory_management@example.com",
};

const config: TConfig = envSchema.parse(env);

export default config;
