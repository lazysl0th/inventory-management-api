import z from "zod";
import User, { userSchema } from "./User.js";
import { v7 } from "uuid";

export const commentSchema = z.object({
  id: z.uuid({ version: "v7" }),
  content: z.string().trim().min(1),
  user: z.uuid({ version: "v7" }).or(userSchema),
  inventoryId: z.uuid({ version: "v7" }),
  createdAt: z.date(),
});

export type TCommentsProrps = z.infer<typeof commentSchema>;

export type TCommentCreateProps = Pick<
  TCommentsProrps,
  "content" | "inventoryId" | "user"
>;

export default class Comment {
  readonly id: string;
  readonly content: string;
  private readonly user: User | { id: string };
  readonly inventoryId: string;
  readonly createdAt: Date;

  constructor(props: TCommentsProrps) {
    this.id = props.id;
    this.content = props.content;
    this.user =
      typeof props.user === "string"
        ? { id: props.user }
        : User.restore(props.user);
    this.inventoryId = props.inventoryId;
    this.createdAt = props.createdAt;
  }

  public static create(props: TCommentCreateProps): Comment {
    return new Comment({
      ...props,
      id: v7(),
      createdAt: new Date(),
    });
  }

  public static restore(props: TCommentsProrps): Comment {
    return new Comment(props);
  }

  toPersistence() {
    return {
      id: this.id,
      content: this.content,
      user: this.user.id,
      inventory: this.inventoryId,
      createdAt: this.createdAt,
    };
  }

  public toJSON(): TCommentsProrps {
    return {
      id: this.id,
      content: this.content,
      user: this.user instanceof User ? this.user.toJSON() : this.user.id,
      inventoryId: this.inventoryId,
      createdAt: this.createdAt,
    };
  }
}
