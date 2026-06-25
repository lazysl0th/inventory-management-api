import z from "zod";
import { userSchema } from "../entities/User.js";

export const allowedUserSchema = userSchema.pick({ id: true, email: true });

type TAllowedUserProps = z.infer<typeof allowedUserSchema>;

//type TCreateAllowedUserProps = Pick<TAllowedUserProps, "id">;

export default class AllowedUser {
  readonly id: string;
  readonly email: string;

  constructor(props: TAllowedUserProps) {
    this.id = props.id;
    this.email = props.email;
  }

  /*public static create(props: TCreateAllowedUserProps) {
    return new AllowedUser({...props, email: null});
  }*/

  public static restore(props: TAllowedUserProps) {
    return new AllowedUser(props);
  }

  public toJSON(): TAllowedUserProps {
    return { id: this.id, email: this.email };
  }
}
