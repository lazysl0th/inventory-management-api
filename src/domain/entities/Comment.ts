import type { TCreateCommentDto } from "#/application/comment/dtos/CommentDto.js";
import type { ICreateUserProps } from "./User.js";
import { v7 } from "uuid";

type TAuthor = Pick<ICreateUserProps, "id" | "name">;

export interface ICommentProps {
  id: string;
  content: string;
  user: TAuthor | { id: string };
  inventoryId: number;
  createdAt: Date;
}

function isTAuthor(user: unknown): user is ICreateUserProps {
  return typeof user === "object" && user !== null && "name" in user;
}

export default class Comment {
  readonly id: string;
  readonly content: string;
  private readonly user: TAuthor | { id: string };
  readonly inventoryId: number;
  readonly createdAt: Date;

  constructor(props: ICommentProps) {
    this.id = props.id;
    this.content = props.content;
    this.user = props.user;
    this.inventoryId = props.inventoryId;
    this.createdAt = props.createdAt;
  }

  public static create(props: TCreateCommentDto): Comment {
    return new Comment({
      ...props,
      user: { id: props.userId },
      id: v7(),
      createdAt: new Date(),
    });
  }

  get author(): TAuthor | { id: string } {
    return this.user;
  }

  public toJSON(): ICommentProps {
    return {
      id: this.id,
      content: this.content,
      user: isTAuthor(this.user)
        ? { id: this.user.id, name: this.user.name }
        : { id: this.user.id },
      inventoryId: this.inventoryId,
      createdAt: this.createdAt,
    };
  }
}
