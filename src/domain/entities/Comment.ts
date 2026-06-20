import type { IUserData } from "./User.js";

type TAuthor = Pick<IUserData, "id" | "name">;

export interface ICommentProps {
  id: string;
  content: string;
  user: TAuthor | { id: number };
  inventoryId: number | null;
  createdAt: Date;
}

function isTAuthor(user: unknown): user is IUserData {
  return typeof user === "object" && user !== null && "name" in user;
}

export default class Comment {
  readonly id: string;
  readonly content: string;
  private readonly user: TAuthor | { id: number };
  readonly inventoryId: number | null;
  readonly createdAt: Date;

  constructor(props: ICommentProps) {
    this.id = props.id;
    this.content = props.content;
    this.user = props.user;
    this.inventoryId = props.inventoryId;
    this.createdAt = props.createdAt;
  }

  get author(): TAuthor | { id: number } {
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
