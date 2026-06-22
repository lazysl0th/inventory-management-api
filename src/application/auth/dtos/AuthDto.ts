import { userSchema } from "#/application/user/dtos/UserDto.js";
import type User from "#/domain/entities/User.js";
import z from "zod";

export const signupSchema = z.object({
  body: userSchema.extend({
    password:
      z.string() /*.refine((value) => validator.isStrongPassword(value), {
      message:
        "Password must be at least 8 characters long and include uppercase and lowercase letters, numbers, and special characters.",
    })*/,
  }),
});

export const localSigninSchema = z.object({
  body: signupSchema.shape.body.omit({ name: true }).extend({
    remember: z.boolean().optional(),
  }),
});

export const socialSigninSchema = z.object({
  body: userSchema.extend({
    provider: z.enum(["google", "facebook"]),
    providerId: z.string(),
  }),
});

export const resetPasswordSchema = z.object({
  body: signupSchema.shape.body.pick({ email: true }),
});

export const changePasswordSchema = z.object({
  body: signupSchema.shape.body.pick({ password: true }).extend({
    token: z.jwt(),
  }),
});

export const authTokensSchema = z.object({
  accessToken: z.jwt(),
  refreshToken: z.jwt(),
});

export const authResponseSchema = authTokensSchema.pick({ accessToken: true });

export const authTextResponseSchema = z.object({
  message: z.string(),
});

export const jwtResetPasswordPayloadSchema = z.object({
  userId: z.string(),
  type: z.literal("resetPassword"),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export const jwtRefreshPayloadSchema = z.object({
  userId: z.string(),
  type: z.literal("refresh"),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export const cookiesTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.jwt().optional(),
  }),
});

export type TLocalLoginBodyDto = z.infer<typeof localSigninSchema>["body"];

export type TSocialLoginBodyDto = z.infer<typeof socialSigninSchema>["body"];

export type TSocialProvider = z.infer<
  typeof socialSigninSchema
>["body"]["provider"];

export type TRegisterBodyDto = z.infer<typeof signupSchema>["body"];

export type TAuthTokens = z.infer<typeof authTokensSchema>;

export interface IAuthResult {
  authTokens: TAuthTokens;
  user: User;
}

export type TResetPasswordBodyDto = z.infer<typeof resetPasswordSchema>["body"];

export type TChangePasswordBodyDto = z.infer<
  typeof changePasswordSchema
>["body"];

export type TAuthResponseDto = z.infer<typeof authResponseSchema>;

export type TAuthTextResponseDto = z.infer<typeof authTextResponseSchema>;

export type TJwtResetPasswordPayload = z.infer<
  typeof jwtResetPasswordPayloadSchema
>;

export type TCookiesTokenDto = z.infer<typeof cookiesTokenSchema>["cookies"];
