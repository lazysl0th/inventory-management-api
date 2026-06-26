import z from "zod";

export const customIdFormatPartType = z.enum([
  "TEXT",
  "RANDOM6",
  "RANDOM9",
  "RANDOM20",
  "RANDOM32",
  "GUID",
  "DATETIME",
  "SEQUENCE",
]);

const customIdFormatPartFormatEnum = z.enum([
  "D1",
  "D2",
  "D3",
  "D4",
  "D6",
  "D10",
  "X5",
  "X8",
  "YYYY",
  "YYYYMM",
  "YYYYMMDD",
  "YYYYMMDD-HHmm",
  "YYYYMMDD-HHmmss",
]);

const customIdFormatPartFormat = z
  .union([customIdFormatPartFormatEnum, z.string()])
  .nullable();

export const customIdFormatPartSchema = z.object({
  id: z.string(),
  type: customIdFormatPartType,
  order: z.number(),
  value: z.string(),
  format: customIdFormatPartFormat,
  position: z.enum(["suffix", "prefix"]),
  separator: z.string(),
  currentSequence: z.number(),
});

export type TCustomIdPartType = z.infer<
  typeof customIdFormatPartSchema
>["type"];

export type TCustomIdPartFormat = z.infer<typeof customIdFormatPartFormatEnum>;

type TCustomIdPartFormatProp = z.infer<
  typeof customIdFormatPartSchema
>["format"];

type TPartSeparatorPosition = z.infer<
  typeof customIdFormatPartSchema
>["position"];

export type TCustomIdFormatPartProps = z.infer<typeof customIdFormatPartSchema>;

export type TCreateCustomIdFormatPartProps = Omit<
  TCustomIdFormatPartProps,
  "id"
>;

export default class CustomIdFormatPart {
  id: string;
  type: TCustomIdPartType;
  order: number;
  value: string;
  format: TCustomIdPartFormatProp;
  position: TPartSeparatorPosition;
  separator: string;
  currentSequence: number;

  constructor(props: TCustomIdFormatPartProps) {
    this.id = props.id;
    this.type = props.type;
    this.order = props.order;
    this.value = props.value;
    this.format = props.format;
    this.position = props.position;
    this.separator = props.separator;
    this.currentSequence = props.currentSequence;
  }

  public static create(
    props: TCreateCustomIdFormatPartProps,
  ): CustomIdFormatPart {
    return new CustomIdFormatPart({
      ...props,
      id: crypto.randomUUID(),
    });
  }

  public static restore(props: TCustomIdFormatPartProps): CustomIdFormatPart {
    return new CustomIdFormatPart(props);
  }

  public toJSON(): TCustomIdFormatPartProps {
    return {
      id: this.id,
      type: this.type,
      order: this.order,
      value: this.value,
      format: this.format,
      position: this.position,
      separator: this.separator,
      currentSequence: this.currentSequence,
    };
  }
}
