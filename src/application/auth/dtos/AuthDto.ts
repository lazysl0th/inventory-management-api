import validator from "validator";
import z from "zod";

export const signinSchema = z.object({
  email: z.email("Incorrect email format"),
  password: z.string().refine((value) => validator.isStrongPassword(value), {
    message:
      "Password must be at least 8 characters long and include uppercase and lowercase letters, numbers, and special characters.",
  }),
  rememberMe: z.stringbool().optional(),
});

export const signupSchema = signinSchema.omit({ rememberMe: true }).extend({
  name: z.string().min(1, "Name must be at least 1 characters long"),
});

export const resetPasswordSchema = signinSchema.pick({ email: true });

export const authResponseSchema = z.object({
  accessToken: z.string(),
});
/*
export const jwtPayloadSchema = z.object({
  id: z.string().meta({
    description: authResponseDescription.idDescription,
    example: authResponseDescription.idExample,
  }),
  iat: z.number().optional(),
  exp: z.number().optional(),
})

export const cookieTokenSchema = z.object({
  token: z.string(token.invalidFormat).min(1, token.required).meta({
    description: token.description,
    example: token.example,
  }),
})
*/
export type TLoginBodyDto = z.infer<typeof signinSchema>;

export type TRegisterBodyDto = z.infer<typeof signupSchema>;

export type TResetPasswordBodyDto = z.infer<typeof resetPasswordSchema>;

export type TAuthUserResponseDto = z.infer<typeof authResponseSchema>;

//export type TJwtPayloadDto = z.infer<typeof jwtPayloadSchema>

//export type TCookieDto = z.infer<typeof cookieTokenSchema>
