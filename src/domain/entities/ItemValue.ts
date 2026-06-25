import z from "zod";
import InventoryField, { inventoryFieldSchema } from "./InventoryField.js";
import { v7 } from "uuid";

export const itemValueSchema = z.object({
  id: z.uuid(),
  value: z.string(),
  field: z.uuid().or(inventoryFieldSchema),
});

export type TItemValueProps = z.infer<typeof itemValueSchema>;

export type TCreateItemValueProps = Omit<TItemValueProps, "id">;

export default class ItemValue {
  readonly id: string;
  value: string;
  field: InventoryField | { id: string };

  constructor(props: TItemValueProps) {
    this.id = props.id;
    this.value = props.value;
    this.field =
      typeof props.field === "string"
        ? { id: props.field }
        : InventoryField.restore(props.field);
  }

  public static create(props: TCreateItemValueProps): ItemValue {
    return new ItemValue({ ...props, id: v7() });
  }

  public static restore(props: TItemValueProps): ItemValue {
    return new ItemValue(props);
  }

  public toJSON(): TItemValueProps {
    return {
      id: this.id,
      value: this.value,
      field:
        this.field instanceof InventoryField
          ? this.field.toJSON()
          : this.field.id,
    };
  }
}
