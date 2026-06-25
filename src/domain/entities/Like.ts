import z from "zod";
import { v7 } from "uuid";

export const likeSchema = z.object({
  id: z.uuid(),
  itemId: z.uuid(),
  userId: z.uuid(),
});

type TLikeProps = z.infer<typeof likeSchema>;

type TCeateLikeProps = Omit<TLikeProps, "id">;

export default class Like {
  public readonly id: string;
  itemId: string;
  userId: string;

  constructor(props: TLikeProps) {
    this.id = props.id;
    this.itemId = props.itemId;
    this.userId = props.userId;
  }

  public static create(props: TCeateLikeProps): Like {
    return new Like({
      ...props,
      id: v7(),
    });
  }

  public static restore(props: TLikeProps): Like {
    return new Like(props);
  }

  public toJSON(): TLikeProps {
    return {
      id: this.id,
      itemId: this.itemId,
      userId: this.userId,
    };
  }
}
