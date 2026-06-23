import { inject, injectable } from "tsyringe";
import type {
  TInventory,
  TInventoryField,
  TUpdateInventoryData,
} from "../../../types/models/Inventory.js";
import type {
  InventoryFieldScalarWhereInput,
  InventoryFieldUncheckedCreateWithoutInventoryInput,
  InventoryFieldUpdateManyWithoutInventoryNestedInput,
  InventoryFieldUpdateWithWhereUniqueWithoutInventoryInput,
  InventoryUpdateInput,
  TagCreateOrConnectWithoutInventoriesInput,
  TagCreateWithoutInventoriesInput,
  TagUpdateManyWithoutInventoriesNestedInput,
  UserUpdateManyWithoutAllowedInventoriesNestedInput,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import type { TSafeUserWithRoles } from "#/application/user/interfaces/IUserRepository.js";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";

@injectable()
export default class UpdateInventory {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(
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
    return await this.inventoryRepository.updateById(
      inventoryId,
      inventoryUpdateData,
      inventoryData.version,
    );
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

  private _connectOrCreateTags(
    tags: TagCreateWithoutInventoriesInput[],
  ): TagCreateOrConnectWithoutInventoriesInput[] {
    return tags.map((tag) => ({
      where: { name: tag.name, id: tag.id },
      create: { name: tag.name, id: tag.id },
    }));
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

  private _setAllowedUser(
    allowedUsers: TSafeUserWithRoles[] | undefined,
  ): UserUpdateManyWithoutAllowedInventoriesNestedInput {
    return allowedUsers
      ? { set: allowedUsers.map((user) => ({ id: user.id })) }
      : {};
  }
}
