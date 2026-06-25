import z from "zod";

export const likeSchema = z.object({
  itemId: z.uuid(),
  userId: z.uuid(),
});

export type TLikeProps = z.infer<typeof likeSchema>;

export default class Like {
  public readonly itemId: string;
  public readonly userId: string;

  constructor(props: TLikeProps) {
    this.itemId = props.itemId;
    this.userId = props.userId;
  }

  public toJSON(): TLikeProps {
    return {
      itemId: this.itemId,
      userId: this.userId,
    };
  }
}
