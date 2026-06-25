import { v7 } from "uuid";
import z from "zod";
import Inventory, { inventorySchema } from "./Inventory.js";
import User, { userSchema } from "./User.js";
import ItemValue, {
  itemValueSchema,
  type TCreateItemValueProps,
  type TItemValueProps,
} from "./ItemValue.js";

export const itemSchema = z.object({
  id: z.uuid(),
  customId: z.string(),
  inventory: z.uuid().or(inventorySchema),
  owner: z.uuid().or(userSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  values: z.array(itemValueSchema),
});

export const createItemSchema = itemSchema
  .pick({ owner: true, values: true })
  .extend({
    inventoryId: z.uuid(),
    owner: itemSchema.shape.owner.options[0],
  });

type TItemProps = z.infer<typeof itemSchema>;

export type TCreateItemProps = Pick<
  TItemProps,
  "customId" | "owner" | "values" | "inventory"
>;

export type TUpdateItemProps = Partial<
  Omit<TItemProps, "id | createdAt | owner">
>;

export default class Item {
  public readonly id: string;
  public customId: string;
  public readonly inventory: Inventory | { id: string };
  public readonly owner: User | { id: string };
  public readonly createdAt: Date;
  public updatedAt: Date;
  #values: Map<string, ItemValue> = new Map();

  constructor(props: TItemProps) {
    this.id = props.id;
    this.customId = props.customId;
    this.inventory =
      typeof props.inventory === "string"
        ? { id: props.inventory }
        : Inventory.restore(props.inventory);
    this.owner =
      typeof props.owner === "string"
        ? { id: props.owner }
        : User.restore(props.owner);
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.setValues(props.values);
  }

  public static create(props: TCreateItemProps): Item {
    return new Item({
      ...props,
      id: v7(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static restore(props: TItemProps): Item {
    return new Item(props);
  }

  public update(props: TUpdateItemProps): void {
    if (props.customId !== undefined) this.changeCustomId(props.customId);
    if (props.values !== undefined) this.setValues(props.values);
    this.changeUpdatedAt();
  }
  public changeCustomId(customId: string): void {
    this.customId = customId;
  }

  public changeUpdatedAt(): void {
    this.updatedAt = new Date();
  }

  public setValues(
    valuesProps: (TItemValueProps | TCreateItemValueProps)[],
  ): void {
    const valuesMap = new Map<string, ItemValue>();
    valuesProps.forEach((valueProps) => {
      const value =
        "id" in valueProps
          ? ItemValue.restore(valueProps)
          : ItemValue.create(valueProps);
      valuesMap.set(value.id, value);
    });
    this.#values = valuesMap;
  }

  public toPersistence() {
    return {
      id: this.id,
      owner: this.owner.id,
      values: this.values.map((value) => value.toPersistence()),
      customId: this.customId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      inventory: this.inventory.id,
    };
  }

  public get values(): ItemValue[] {
    return Array.from(this.#values.values());
  }

  public toJSON(): TItemProps {
    return {
      id: this.id,
      customId: this.customId,
      inventory:
        this.inventory instanceof Inventory
          ? this.inventory.toJSON()
          : this.inventory.id,
      owner: this.owner instanceof User ? this.owner.toJSON() : this.owner.id,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      values: this.values.map((value) => value.toJSON()),
    };
  }
}
