import type { InjectionToken } from "tsyringe";

import { z } from "zod";

export enum NodeEnv {
  Development = "development",
  Production = "production",
}

export const envSchema = z.object({
  NODE_ENV: z.enum(NodeEnv),
  PORT: z.coerce.number(),
  FRONTEND_URL: z.url(),
  BACKEND_URL: z.url(),
  SHUTDOWN_SERVER_TIMEOUT: z.coerce.number(),
  DATABASE_URL: z.url(),
  SALT_ROUNDS: z.coerce.number(),
  JWT_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRES: z.coerce.number(),
  RESET_PASSWORD_TOKEN_EXPIRES: z.coerce.number(),
  REFRESH_TOKEN_EXPIRES: z.coerce.number(),
  REMEMBER_REFRESH_TOKEN_EXPIRES: z.coerce.number(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URL: z.url(),
  GOOGLE_REFRESH_TOKEN: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.url(),
  FACEBOOK_CLIENT_ID: z.string().min(1),
  FACEBOOK_CLIENT_SECRET: z.string().min(1),
  FACEBOOK_CALLBACK_URL: z.url(),
});

export type TConfig = z.infer<typeof envSchema>;

export type TPort = Pick<TConfig, "PORT">;

export type TTerminusConfig = Pick<TConfig, "SHUTDOWN_SERVER_TIMEOUT" | "PORT">;

export type TPrismaConfig = Pick<TConfig, "DATABASE_URL">;

export type TCorsConfig = Pick<TConfig, "FRONTEND_URL">;

export type THashServiceConfig = Pick<TConfig, "SALT_ROUNDS">;

export type TJwtServiceConfig = Pick<TConfig, "JWT_SECRET">;

export type TJwtExpiresConfig = Pick<
  TConfig,
  | "ACCESS_TOKEN_EXPIRES"
  | "REFRESH_TOKEN_EXPIRES"
  | "RESET_PASSWORD_TOKEN_EXPIRES"
  | "REMEMBER_REFRESH_TOKEN_EXPIRES"
>;

export type TGoogleConfig = Pick<
  TConfig,
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET"
  | "GOOGLE_REDIRECT_URL"
  | "GOOGLE_REFRESH_TOKEN"
  | "GOOGLE_CALLBACK_URL"
>;

export type TFrontendUrlConfig = TCorsConfig;

export type TFacebookConfig = Pick<
  TConfig,
  "FACEBOOK_CLIENT_ID" | "FACEBOOK_CLIENT_SECRET" | "FACEBOOK_CALLBACK_URL"
>;

export const CONFIG_TOKEN: InjectionToken<TConfig> = Symbol("CONFIG");
