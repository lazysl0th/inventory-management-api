import { v7 } from "uuid";
import User, { userSchema } from "./User.js";
import Tag, { tagSchema } from "../value-objects/Tag.js";
import CustomIdFormat, {
  customIdFormatSchema,
} from "../value-objects/CustomIdFormat.js";
import InventoryField, {
  inventoryFieldSchema,
  type TCreateInventoryFieldProps,
  type TInventoryFieldProps,
} from "./InventoryField.js";
import z from "zod";
import AllowedUser, {
  allowedUserSchema,
} from "../value-objects/AllowedUser.js";

const categorySchema = z.enum(["Equipment", "Furniture", "Book", "Other"]);

export const inventorySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  category: categorySchema,
  description: z.string().nullable(),
  image: z.string().nullable(),
  tags: z.array(z.string().or(tagSchema)),
  isPublic: z.stringbool({
    truthy: ["true"],
    falsy: ["false"],
  }),
  allowedUsers: z.array(z.uuid().or(allowedUserSchema)),
  customIdFormat: customIdFormatSchema,
  fields: inventoryFieldSchema.array(),
  owner: z.uuid().or(userSchema),
  token: z.jwt().nullable(),
  version: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type TCategory = z.infer<typeof categorySchema>;

type TInventoryProps = z.infer<typeof inventorySchema>;

export type TCreateInventoryProps = Pick<
  TInventoryProps,
  | "title"
  | "category"
  | "owner"
  | "description"
  | "image"
  | "tags"
  | "isPublic"
  | "allowedUsers"
  | "token"
  | "customIdFormat"
  | "fields"
>;

export type TUpdateInventoryProps = Partial<
  Omit<TInventoryProps, "id | createdAt | owner">
> &
  Required<Pick<TInventoryProps, "id">>;

type TAllowedUsersProp = z.infer<typeof inventorySchema>["allowedUsers"];

type TTagsProp = z.infer<typeof inventorySchema>["tags"];

type TCustomIdFormatProp = z.infer<typeof inventorySchema>["customIdFormat"];

export default class Inventory {
  readonly id: string;
  title: string;
  category: TCategory;

  description: string | null;
  image: string | null;

  token: string | null;
  isPublic: boolean;

  #allowedUsers: Map<string, AllowedUser | { id: string }> = new Map();

  #tags: Map<string, Tag | { name: string }> = new Map();

  #fields: Map<string, InventoryField> = new Map();

  readonly owner: User | { id: string };
  version: number;
  readonly createdAt: Date;
  updatedAt: Date;
  customIdFormat: CustomIdFormat;

  constructor(props: TInventoryProps) {
    this.id = props.id;
    this.title = props.title;
    this.category = props.category;
    this.owner =
      typeof props.owner === "string"
        ? { id: props.owner }
        : User.restore(props.owner);
    this.version = props.version;
    this.description = props.description ?? null;
    this.image = props.image ?? null;
    this.token = props.token ?? null;
    this.isPublic = props.isPublic;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.setAllowedUsers(props.allowedUsers);

    this.setTags(props.tags);

    this.customIdFormat = new CustomIdFormat(props.customIdFormat);

    this.setFields(props.fields);
  }

  public setAllowedUsers(allowedUsers: TAllowedUsersProp): void {
    const allowedUserMap = new Map<string, User | { id: string }>();
    allowedUsers.forEach((allowedUserProps) => {
      const allowedUser =
        typeof allowedUserProps === "string"
          ? { id: allowedUserProps }
          : new AllowedUser(allowedUserProps);
      allowedUserMap.set(allowedUser.id, allowedUser);
    });
    this.#allowedUsers = allowedUserMap;
  }

  public setTags(tags: TTagsProp): void {
    const tagsMap = new Map<string, Tag | { name: string }>();
    tags.forEach((tagProps) => {
      const tag =
        typeof tagProps === "string" ? { name: tagProps } : new Tag(tagProps);

      tagsMap.set(tag.name, tag);
    });
    this.#tags = tagsMap;
  }

  public setFields(
    fields: (TInventoryFieldProps | TCreateInventoryFieldProps)[],
  ): void {
    const fieldsMap = new Map<string, InventoryField>();
    fields.forEach((fieldProps) => {
      const field =
        "id" in fieldProps
          ? InventoryField.restore(fieldProps)
          : InventoryField.create(fieldProps);
      fieldsMap.set(field.id, field);
    });
    this.#fields = fieldsMap;
  }

  public static create(props: TCreateInventoryProps): Inventory {
    return new Inventory({
      ...props,
      id: v7(),
      updatedAt: new Date(),
      createdAt: new Date(),
      version: 1,
      token: null,
    });
  }

  public static restore(props: TInventoryProps): Inventory {
    return new Inventory(props);
  }

  public update(props: TUpdateInventoryProps): void {
    if (props.title !== undefined) this.changeTitle(props.title);
    if (props.category !== undefined) this.changeCategory(props.category);
    if (props.description !== undefined)
      this.changeDescription(props.description);
    if (props.image !== undefined) this.changeImage(props.image);
    if (props.isPublic !== undefined) this.changeIsPublic(props.isPublic);
    if (props.tags !== undefined) this.setTags(props.tags);
    if (props.allowedUsers !== undefined)
      this.setAllowedUsers(props.allowedUsers);
    if (props.token !== undefined) this.changeToken(props.token);
    if (props.customIdFormat !== undefined)
      this.changeCustomIdFormat(props.customIdFormat);
    if (props.fields !== undefined) this.setFields(props.fields);

    this.changeUpdatedAt();
    this.incrementVersion();
  }

  toPersistence() {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      owner: this.owner.id,
      description: this.description,
      customIdFormat: this.customIdFormat.toJSON(),
      image: this.image,
      tags: this.tags,
      token: this.token,
      isPublic: this.isPublic,
      allowedUsers: this.allowedUsers,
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      fields: this.fields,
    };
  }

  public changeTitle(title: string): void {
    if (this.title === title) return;
    this.title = title;
  }

  public changeDescription(description: string | null): void {
    if (this.description === description) return;
    this.description = description;
  }

  public changeImage(image: string | null): void {
    if (this.image === image) return;
    this.image = image;
  }

  public changeCategory(category: TCategory): void {
    if (this.category === category) return;
    this.category = category;
  }

  public changeIsPublic(isPublic: boolean): void {
    if (this.isPublic === isPublic) return;
    this.isPublic = isPublic;
  }

  public changeCustomIdFormat(customIdFormat: TCustomIdFormatProp): void {
    this.customIdFormat = new CustomIdFormat(customIdFormat);
  }

  public incrementVersion(): void {
    this.version++;
  }

  public changeUpdatedAt(): void {
    this.updatedAt = new Date();
  }

  public changeToken = (token: string | null): void => {
    if (this.token === token) return;
    this.token = token;
  };

  public get fileds(): InventoryField[] {
    return Array.from(this.#fields.values());
  }

  public get tags(): (Tag | { name: string })[] {
    return Array.from(this.#tags.values());
  }

  public get allowedUsers(): (User | { id: string })[] {
    return Array.from(this.#allowedUsers.values());
  }

  public get fields(): InventoryField[] {
    return Array.from(this.#fields.values());
  }

  public toJSON(): TInventoryProps {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      description: this.description,
      image: this.image,
      tags: this.tags.map((tag) => (tag instanceof Tag ? tag.toJSON() : tag)),
      token: this.token,
      isPublic: this.isPublic,
      allowedUsers: this.allowedUsers.map((user) =>
        user instanceof AllowedUser ? user.toJSON() : user.id,
      ),
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      customIdFormat: this.customIdFormat.toJSON(),
      fields: this.fileds,
      owner: this.owner instanceof User ? this.owner.toJSON() : this.owner.id,
    };
  }
}
