import { userSchema } from "#/domain/entities/User.js";
import z from "zod";

export const roleSchema = z.object({
  userId: userSchema.shape.id,
  roleId: z.uuid(),
});

export const changeRolesSchema = z.object({
  body: z.object({
    userIds: z.array(userSchema.shape.id),
    roleIds: z.array(z.uuid()),
  }),
});

export type TChangeRoleResult = {
  count: number;
};

export type TChangeRoleBody = z.infer<typeof changeRolesSchema>["body"];

export type TRole = z.infer<typeof roleSchema>;
