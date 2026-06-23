import crypto from "crypto";

import type {
  EnumInventorySortOrder,
  IInventoryService,
} from "../types/services/Inventory.js";
import type {
  IInventoryData,
  IInventoryModel,
  TInventory,
  TInventoryField,
  TUpdateInventoryData,
} from "../types/models/Inventory.js";

import { BAD_REQUEST, NOT_FOUND } from "../constants/response.js";
import type {
  InventoryCreateInput,
  InventoryFieldCreateNestedManyWithoutInventoryInput,
  InventoryFieldCreateWithoutInventoryInput,
  InventoryFieldScalarWhereInput,
  InventoryFieldUncheckedCreateWithoutInventoryInput,
  InventoryFieldUpdateManyWithoutInventoryNestedInput,
  InventoryFieldUpdateWithWhereUniqueWithoutInventoryInput,
  InventoryUpdateInput,
  TagCreateNestedManyWithoutInventoriesInput,
  TagCreateOrConnectWithoutInventoriesInput,
  TagCreateWithoutInventoriesInput,
  TagUpdateManyWithoutInventoriesNestedInput,
  UserCreateNestedManyWithoutAllowedInventoriesInput,
  UserUpdateManyWithoutAllowedInventoriesNestedInput,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import NotFound from "#/domain/errors/NotFound.js";
import BadRequest from "#/domain/errors/BadRequest.js";
import type { TSafeUserWithRoles } from "#/application/user/interfaces/IUserRepository.js";

export default class InventoryService implements IInventoryService {
  constructor(private readonly InventoryModel: IInventoryModel) {}

  async getInventoryById(id: number): Promise<TInventory> {
    const inventory = await this.InventoryModel.getById(id);
    if (!inventory) throw new NotFound(NOT_FOUND.TEXT);
    return inventory;
  }

  async getInventories(
    sortOrder?: EnumInventorySortOrder,
    ownerId?: string,
    allowedUserId?: string,
    isPublic?: boolean,
  ): Promise<TInventory[]> {
    return await this.InventoryModel.getAll(
      sortOrder,
      ownerId,
      allowedUserId,
      isPublic,
    );
  }

  private _connectOrCreateTags(
    tags: TagCreateWithoutInventoriesInput[],
  ): TagCreateOrConnectWithoutInventoriesInput[] {
    return tags.map((tag) => ({
      where: { name: tag.name, id: tag.id },
      create: { name: tag.name, id: tag.id },
    }));
  }

  private _tagsForCreateInventory(
    tags: TagCreateWithoutInventoriesInput[],
  ): TagCreateNestedManyWithoutInventoriesInput {
    return { connectOrCreate: this._connectOrCreateTags(tags) };
  }

  private _tagsForUpdateInventory(
    tags: TagCreateWithoutInventoriesInput[] | undefined,
  ): TagUpdateManyWithoutInventoriesNestedInput {
    return tags
      ? {
          set: [],
          connectOrCreate: this._connectOrCreateTags(tags),
        }
      : {};
  }

  private _createFields(
    fields: InventoryFieldUncheckedCreateWithoutInventoryInput[],
  ): InventoryFieldUncheckedCreateWithoutInventoryInput[] {
    return fields
      .filter((field) => !field.id)
      .map((field) => ({
        title: field.title,
        type: field.type,
        description: field.description ?? null,
        showInTable: field.showInTable ?? false,
        order: field.order,
      }));
  }

  private _deleteFields(
    fields: TInventoryField[],
  ): InventoryFieldScalarWhereInput {
    return {
      id: {
        notIn: fields.filter((field) => field.id).map((field) => field.id),
      },
    };
  }

  private _updateFields(
    fields: TInventoryField[],
  ): InventoryFieldUpdateWithWhereUniqueWithoutInventoryInput[] {
    return fields
      .filter((fields) => fields.id)
      .map((field) => ({
        where: { id: field.id },
        data: {
          title: field.title,
          type: field.type,
          description: field.description,
          showInTable: field.showInTable,
          order: field.order,
        },
      }));
  }

  private _fieldsForCreateInventory(
    fields: InventoryFieldCreateWithoutInventoryInput[],
  ): InventoryFieldCreateNestedManyWithoutInventoryInput {
    return { create: this._createFields(fields) };
  }

  private _fieldsForUpdateInventory(
    fields: TInventoryField[] | undefined,
  ): InventoryFieldUpdateManyWithoutInventoryNestedInput {
    return fields
      ? {
          deleteMany: this._deleteFields(fields),
          update: this._updateFields(fields),
          create: this._createFields(fields),
        }
      : {};
  }

  private _connectAllowedUser(
    allowedUsers: TSafeUserWithRoles[],
  ): UserCreateNestedManyWithoutAllowedInventoriesInput {
    return { connect: allowedUsers.map((user) => ({ id: user.id })) };
  }

  private _setAllowedUser(
    allowedUsers: TSafeUserWithRoles[] | undefined,
  ): UserUpdateManyWithoutAllowedInventoriesNestedInput {
    return allowedUsers
      ? { set: allowedUsers.map((user) => ({ id: user.id })) }
      : {};
  }

  async createInventory(
    userId: string,
    inventoryData: IInventoryData,
  ): Promise<TInventory> {
    const inventoryCreateData: InventoryCreateInput = {
      ...inventoryData,
      owner: { connect: { id: userId } },
      tags: this._tagsForCreateInventory(inventoryData.tags),
      fields: this._fieldsForCreateInventory(inventoryData.fields),
      allowedUsers: this._connectAllowedUser(inventoryData.allowedUsers),
    };
    return await this.InventoryModel.create(inventoryCreateData);
  }

  async updateInventory(
    inventoryId: number,
    inventoryData: TUpdateInventoryData,
  ): Promise<TInventory> {
    const inventoryUpdateData: InventoryUpdateInput = {
      ...inventoryData,
      version: { increment: 1 },
      tags: this._tagsForUpdateInventory(inventoryData.tags),
      fields: this._fieldsForUpdateInventory(inventoryData.fields),
      allowedUsers: this._setAllowedUser(inventoryData.allowedUsers),
    };
    return await this.InventoryModel.updateById(
      inventoryId,
      inventoryUpdateData,
      inventoryData.version,
    );
  }

  async deleteInventories(ids: number[]): Promise<{ count: number }> {
    return await this.InventoryModel.deleteByIds(ids);
  }

  async getTokenInventory(id: number): Promise<string> {
    const inventory = await this.getInventoryById(id);
    if (!inventory.token) return await this.createTokenInventory(inventory);
    else return inventory.token;
  }

  async createTokenInventory(inventory: TInventory): Promise<string> {
    const inventoryData = {
      version: inventory.version,
      token: crypto.randomBytes(32).toString("hex"),
    };
    const { token } = await this.updateInventory(inventory.id, inventoryData);
    if (!token) throw new BadRequest(BAD_REQUEST.TEXT);
    return token;
  }

  async searchInventories(query: string): Promise<TInventory[]> {
    const words = query
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length === 0) return [];
    const formattedQuery = words.map((word) => `${word}:*`).join(" & ");
    return await this.InventoryModel.search(formattedQuery);
  }

  async getInventoryByToken(token: string): Promise<void> {
    const inventory = await this.InventoryModel.getByToken(token);
    if (!inventory) throw new NotFound(NOT_FOUND.TEXT);
    //const stats = await getStats(inventory, prisma);
    //return {inventory: { title: inventory.title, fields: inventory.fields, itemsCount: inventory._count.items}, stats: stats};
  }
}

/*export const getItemsCount = (parent, client) => {
    if (parent._count?.items !== undefined) return parent._count.items;
    return itemsCount(parent.id, client);
}

const groupFieldsByType = (fields) => fields.reduce((acc, field) => {
    (acc[field.type] ??= []).push(field);
    return acc;
}, {});

export const getStats = async (parent, client) => {
    try {
        const items = await selectAllItems(parent.id, client);
        const fieldsByType = groupFieldsByType(parent.fields);
        return calculateFieldStats(fieldsByType, items);
    } catch (e) {
        console.log(e)
    }
}*/

/*export const getInventoryInfo = async (apiToken) => {
    const inventory = await selectInventoryByApiToken(apiToken, prisma);
    if (!inventory) throw new NotFound(NOT_FOUND.text);
    const stats = await getStats(inventory, prisma);
    return {inventory: { title: inventory.title, fields: inventory.fields, itemsCount: inventory._count.items}, stats: stats};
}*/
