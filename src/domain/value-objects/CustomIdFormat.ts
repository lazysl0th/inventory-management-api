import z from "zod";
import CustomIdFormatPart, {
  type TCreateCustomIdFormatPartProps,
  type TCustomIdFormatPartProps,
} from "./CustomIdFormatPart.js";
import { customIdFormatPartSchema } from "./CustomIdFormatPart.js";

export const customIdFormatSchema = z.object({
  summary: z.string(),
  parts: z.array(customIdFormatPartSchema).nullable(),
});

type TCustomIdFormatProps = z.infer<typeof customIdFormatSchema>;

export default class CustomIdFormat {
  #parts: Map<string, CustomIdFormatPart> = new Map();
  summary: string;

  constructor(props: TCustomIdFormatProps) {
    this.summary = props.summary;
    this.setParts(props.parts || []);
  }

  setParts(
    customIdFormatParts: (
      | TCustomIdFormatPartProps
      | TCreateCustomIdFormatPartProps
    )[],
  ) {
    const partsMap = new Map<string, CustomIdFormatPart>();
    customIdFormatParts.forEach((partProps) => {
      const part =
        "id" in partProps
          ? CustomIdFormatPart.restore(partProps)
          : CustomIdFormatPart.create(partProps);
      partsMap.set(part.id, new CustomIdFormatPart(part));
    });
  }

  public static restore(props: unknown): TCustomIdFormatProps {
    return customIdFormatSchema.parse(props);
  }

  public get parts(): CustomIdFormatPart[] {
    return Array.from(this.#parts.values());
  }

  public toJSON(): TCustomIdFormatProps {
    return {
      summary: this.summary,
      parts: this.parts.map((part) => part.toJSON()),
    };
  }
}
