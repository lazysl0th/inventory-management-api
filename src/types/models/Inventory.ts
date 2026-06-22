import type { EnumInventorySortOrder } from "../services/Inventory.js";
import type { Settings } from "../settings.js";
import type {
  InventoryCreateInput,
  InventoryFieldGetPayload,
  InventoryGetPayload,
  InventoryUpdateInput,
  TagGetPayload,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import type { Category } from "#/infrastructure/persistence/prisma/generated/enums.js";
import type { InputJsonValue } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";
import type { TUserWithRoles } from "#/application/user/dtos/IUserRepository.js";

export type TInventorySelect = Settings["selects"]["inventory"];

export type TInventory = InventoryGetPayload<{
  select: Settings["selects"]["inventory"];
}>;

export type TInventoryField = Omit<
  InventoryFieldGetPayload<true>,
  "inventoryId"
>;

export type TTag = TagGetPayload<true>;

export type TInventoryCreateData = InventoryCreateInput;

export type TInventoryUpdateData = InventoryUpdateInput;

export interface IInventoryBaseData {
  id: number;
  title: string;
  category: Category;
  version: number;
}

export interface IInventoryData extends IInventoryBaseData {
  description?: string;
  image?: string;
  isPublic?: boolean;
  tags: TTag[];
  fields: TInventoryField[];
  allowedUsers: TUserWithRoles[];
  token?: string;
  customIdFormat?: InputJsonValue;
}

export type TUpdateInventoryData = Partial<IInventoryData> &
  Required<Pick<IInventoryData, "version">>;

export type TInventoryData = Partial<Omit<IInventoryData, "version">> &
  Required<Pick<IInventoryData, "version">>;

export enum EnumCustomIdPartType {
  TEXT = "TEXT",
  RANDOM6 = "RANDOM6",
  RANDOM9 = "RANDOM9",
  RANDOM20 = "RANDOM20",
  RANDOM32 = "RANDOM32",
  GUID = "GUID",
  DATETIME = "DATETIME",
  SEQUENCE = "SEQUENCE",
}

export type TPartSeparatorPosition = "suffix" | "prefix";

export enum EnumCustomIdPartFormatDigit {
  D1 = "D1",
  D2 = "D2",
  D3 = "D3",
  D4 = "D4",
}

export enum EnumCustomIdPartFormatHex {
  X5 = "X5",
  X8 = "X8",
}

export enum EnumCustomIdPartFormatDateTime {
  YYYY = "YYYY",
  YYYYMM = "YYYYMM",
  YYYYMMDD = "YYYYMMDD",
  YYYYMMDDHHmm = "YYYYMMDD-HHmm",
  YYYYMMDDHHmmss = "YYYYMMDD-HHmmss",
}

export type TCustomIdPartFormat =
  | EnumCustomIdPartFormatDigit
  | EnumCustomIdPartFormatHex
  | EnumCustomIdPartFormatDateTime
  | string
  | null;

export interface ICustomIdFormatPart {
  guid: string;
  type: EnumCustomIdPartType;
  order: number;
  value: string;
  format: TCustomIdPartFormat;
  position: TPartSeparatorPosition;
  separator: string;
  currentSequence: number;
}

export interface ICustomIdFormat {
  parts: ICustomIdFormatPart[];
  summary: string;
}

export interface IInventoryModel {
  //inventoryBaseSelect: TInventorySelect;
  getById(id: number): Promise<TInventory | null>;
  getByToken(token: string): Promise<TInventory | null>;
  getAll(
    sortOrder?: EnumInventorySortOrder,
    ownerId?: string,
    allowedUserId?: string,
    isPublic?: boolean,
  ): Promise<TInventory[]>;
  create(data: TInventoryCreateData): Promise<TInventory>;
  updateById(
    id: number,
    data: TInventoryUpdateData,
    version: number,
  ): Promise<TInventory>;
  deleteByIds(ids: number[]): Promise<{ count: number }>;
  search(query: string): Promise<TInventory[]>;
}
