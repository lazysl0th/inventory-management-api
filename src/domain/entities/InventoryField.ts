import { v7 } from "uuid";
import z from "zod";

const fieldTypeSchema = z.enum([
  "TEXT",
  "LONGTEXT",
  "NUMBER",
  "FILE",
  "BOOLEAN",
]);

export const inventoryFieldSchema = z.object({
  id: z.uuid({ version: "v7" }),
  title: z.string(),
  description: z.string().nullable(),
  type: fieldTypeSchema,
  order: z.number(),
  showInTable: z.boolean(),
  isDeleted: z.boolean(),
});

type TFieldType = z.infer<typeof fieldTypeSchema>;

export type TInventoryFieldProps = z.infer<typeof inventoryFieldSchema>;

export type TCreateInventoryFieldProps = Omit<TInventoryFieldProps, "id">;

type TUpdateInventoryFieldProps = Partial<TInventoryFieldProps>;

export default class InventoryField {
  title: string;
  description: string | null;
  id: string;
  type: TFieldType;
  order: number;
  showInTable: boolean;
  isDeleted: boolean;

  constructor(props: TInventoryFieldProps) {
    this.title = props.title;
    this.description = props.description;
    this.id = props.id;
    this.type = props.type;
    this.order = props.order;
    this.showInTable = props.showInTable;
    this.isDeleted = props.isDeleted;
  }

  public static create(props: TCreateInventoryFieldProps): InventoryField {
    return new InventoryField({
      ...props,
      id: v7(),
      isDeleted: false,
    });
  }

  public update(props: TUpdateInventoryFieldProps): void {
    if (props.title !== undefined) this.changeTitle(props.title);
    if (props.description !== undefined)
      this.changeDescription(props.description);
    if (props.type !== undefined) this.changeType(props.type);
    if (props.order !== undefined) this.changeOrder(props.order);
    if (props.showInTable !== undefined)
      this.changeShowInTable(props.showInTable);
  }

  public static restore(props: TInventoryFieldProps): InventoryField {
    return new InventoryField(props);
  }

  public changeTitle(title: string): void {
    this.title = title;
  }

  public changeDescription(description: string | null): void {
    this.description = description;
  }

  public changeType(type: TFieldType): void {
    this.type = type;
  }

  public changeOrder(order: number): void {
    this.order = order;
  }

  public changeShowInTable(showInTable: boolean): void {
    this.showInTable = showInTable;
  }

  public toJSON(): TInventoryFieldProps {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      type: this.type,
      order: this.order,
      showInTable: this.showInTable,
      isDeleted: this.isDeleted,
    };
  }
}
