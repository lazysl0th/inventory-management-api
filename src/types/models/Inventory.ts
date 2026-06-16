import type { Category, Prisma } from "@prisma/client";
import type { IUserData } from "../services/Auth.js";
import type { EnumInventorySortOrder } from "../services/Inventory.js";
import type { Settings } from "../settings.js";
import type { TUserWithRoles } from "./User.js";

export type TInventorySelect = Settings["selects"]["inventory"];

export type TInventory = Prisma.InventoryGetPayload<{
  select: Settings["selects"]["inventory"];
}>;

export type TInventoryField = Omit<
  Prisma.InventoryFieldGetPayload<true>,
  "inventoryId"
>;

export type TTag = Omit<Prisma.TagGetPayload<true>, "id">;

export type TInventoryCreateData = Prisma.InventoryCreateInput;

export type TInventoryUpdateData = Prisma.InventoryUpdateInput;

export interface IInventoryBaseData {
  id: number;
  title: string;
  category: Category;
  version: number;
}

export interface IAllowedUsers extends IUserData {
  id: number;
}

export interface IInventoryData extends IInventoryBaseData {
  description?: string;
  image?: string;
  isPublic?: boolean;
  tags: TTag[];
  fields: TInventoryField[];
  allowedUsers: TUserWithRoles[];
  token?: string;
  customIdFormat?: Prisma.InputJsonValue;
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
    ownerId?: number,
    allowedUserId?: number,
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
