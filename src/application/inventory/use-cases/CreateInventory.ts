import { inject, injectable } from "tsyringe";
import type {
  IInventoryData,
  TInventory,
} from "../../../types/models/Inventory.js";
import type {
  InventoryCreateInput,
  InventoryFieldCreateNestedManyWithoutInventoryInput,
  InventoryFieldCreateWithoutInventoryInput,
  InventoryFieldUncheckedCreateWithoutInventoryInput,
  TagCreateNestedManyWithoutInventoriesInput,
  TagCreateOrConnectWithoutInventoriesInput,
  TagCreateWithoutInventoriesInput,
  UserCreateNestedManyWithoutAllowedInventoriesInput,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import type { TSafeUserWithRoles } from "#/application/user/interfaces/IUserRepository.js";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";

@injectable()
export default class CreateInventory {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(
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
    return await this.inventoryRepository.create(inventoryCreateData);
  }

  private _tagsForCreateInventory(
    tags: TagCreateWithoutInventoriesInput[],
  ): TagCreateNestedManyWithoutInventoriesInput {
    return { connectOrCreate: this._connectOrCreateTags(tags) };
  }

  private _connectOrCreateTags(
    tags: TagCreateWithoutInventoriesInput[],
  ): TagCreateOrConnectWithoutInventoriesInput[] {
    return tags.map((tag) => ({
      where: { name: tag.name, id: tag.id },
      create: { name: tag.name, id: tag.id },
    }));
  }

  private _fieldsForCreateInventory(
    fields: InventoryFieldCreateWithoutInventoryInput[],
  ): InventoryFieldCreateNestedManyWithoutInventoryInput {
    return { create: this._createFields(fields) };
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

  private _connectAllowedUser(
    allowedUsers: TSafeUserWithRoles[],
  ): UserCreateNestedManyWithoutAllowedInventoriesInput {
    return { connect: allowedUsers.map((user) => ({ id: user.id })) };
  }
}
