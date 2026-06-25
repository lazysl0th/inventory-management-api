import z from "zod";

export const tagSchema = z.object({
  name: z.string(),
  count: z.number().optional(),
});

type TTagProps = z.infer<typeof tagSchema>;

type TCreateTagProps = Pick<TTagProps, "name">;

export default class Tag {
  readonly name: string;
  readonly count: number | null;

  constructor(props: TTagProps) {
    this.name = props.name;
    this.count = props.count ?? null;
  }

  public static create(props: TCreateTagProps): Tag {
    return new Tag(props);
  }

  public static restore(props: TTagProps): Tag {
    return new Tag(props);
  }

  public toJSON() {
    return {
      name: this.name,
      count: this.count,
    };
  }
}
