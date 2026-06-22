import z from "zod";

export const getUserSchema = z.object({
  params: z.object({
    userId: z.uuid(),
  }),
});

export const updateUserSchema = z.object({
  params: getUserSchema.shape.params,
  body: z.object({
    name: z.string().min(1, "Name must be at least 1 characters long"),
    email: z.email("Incorrect email format"),
  }),
});

export const updateUsersSchema = z.object({
  body: z.object({
    ids: z.array(z.uuid()),
    data: z.object({
      status: z.enum(["Active", "Blocked"]),
    }),
  }),
});

export const deleteUsersSchema = z.object({
  body: z.object({
    userIds: z.array(z.uuid()),
  }),
});

export const userSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 characters long"),
  email: z.email("Incorrect email format"),
});

export type TUserDto = z.infer<typeof userSchema>;

//type TGetUserDto = z.infer<typeof getUserSchema>["params"];
