import z from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 characters long"),
  email: z.email("Incorrect email format"),
});

export type TUserDto = z.infer<typeof userSchema>;
