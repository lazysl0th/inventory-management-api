import { v7 } from "uuid";
import z from "zod";
import Inventory, { inventorySchema } from "./Inventory.js";
import User, { userSchema } from "./User.js";

export const itemSchema = z.object({
  id: z.uuid(),
  customId: z.string(),
  inventory: z.uuid().or(inventorySchema),
  owner: z.uuid().or(userSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type TItemProps = z.infer<typeof itemSchema>;

type TItemCreateProps = Omit<TItemProps, "id">;

export default class Item {
  public readonly id: string;
  public readonly customId: string;
  public readonly inventory: Inventory | { id: string };
  public readonly owner: User | { id: string };
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

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
  }

  public static create(props: TItemCreateProps): Item {
    return new Item({
      ...props,
      id: v7(),
    });
  }

  public static restore(props: TItemProps): Item {
    return new Item(props);
  }

  public toPersistence() {
    return {
      id: this.id,
    };
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
    };
  }
}
