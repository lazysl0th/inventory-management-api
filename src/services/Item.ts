import { isCustomIdFormatObject } from "../utils.js";
import type { IItemService } from "../types/services/Item.js";
import type {
  IItemData,
  IItemModel,
  IItemValue,
  TItem,
  TLike,
} from "../types/models/Item.js";
import { BAD_REQUEST, NOT_FOUND } from "../constants/response.js";
import type {
  ItemUpdateInput,
  ItemValueCreateNestedManyWithoutItemInput,
  ItemValueScalarWhereInput,
  ItemValueUncheckedCreateWithoutItemInput,
  ItemValueUpdateWithWhereUniqueWithoutItemInput,
} from "#/infrastructure/persistence/prisma/generated/models.js";
import BadRequest from "#/domain/errors/BadRequest.js";
import NotFound from "#/domain/errors/NotFound.js";
import type { IInventoryRepository } from "#/application/inventory/interfaces/IInventoryRepository.js";

export default class ItemService implements IItemService {
  constructor(
    private readonly ItemModel: IItemModel,
    private readonly InventoryService: IInventoryRepository,
  ) {}

  async getItems(inventoryId: number): Promise<TItem[]> {
    return await this.ItemModel.getAll(inventoryId);
  }

  async getItem(id: number): Promise<TItem> {
    const item = await this.ItemModel.getById(id);
    if (!item) throw new NotFound(NOT_FOUND.TEXT);
    return item;
  }

  private _createValues(
    itemValues: ItemValueUncheckedCreateWithoutItemInput[],
  ): ItemValueUncheckedCreateWithoutItemInput[] {
    return itemValues.map((value) => ({
      value:
        typeof value.value !== "boolean"
          ? value.value
          : value.value
            ? "true"
            : "false",
      fieldId: value.fieldId,
    }));
  }

  private _updateValues(
    itemValues: IItemValue[],
  ): ItemValueUpdateWithWhereUniqueWithoutItemInput[] {
    return itemValues
      .filter((value) => value.id)
      .map((value) => ({
        where: { id: value.id },
        data: {
          value:
            typeof value.value !== "boolean"
              ? value.value
              : value.value
                ? "true"
                : "false",
          field: { connect: { id: value.fieldId } },
        },
      }));
  }

  private _deleteValues(itemValues: IItemValue[]): ItemValueScalarWhereInput {
    return {
      id: {
        notIn: itemValues.filter((value) => value.id).map((value) => value.id),
      },
    };
  }

  private _valuesForCreateItem(
    itemValues: ItemValueUncheckedCreateWithoutItemInput[],
  ): ItemValueCreateNestedManyWithoutItemInput {
    return { create: this._createValues(itemValues) };
  }

  private _valuesForUpdateItem(
    itemValues: IItemValue[],
  ): Pick<ItemUpdateInput, "values"> | undefined {
    return itemValues.length
      ? {
          values: {
            deleteMany: this._deleteValues(itemValues),
            update: this._updateValues(itemValues),
            create: this._createValues(
              itemValues.filter((itemValue) => !itemValue.id),
            ),
          },
        }
      : undefined;
  }

  async createItem(
    userId: string,
    inventoryId: number,
    itemValues: IItemValue[],
  ): Promise<TItem> {
    const inventory = await this.InventoryService.getById(
      inventoryId.toString(),
    );
    if (!isCustomIdFormatObject(inventory?.customIdFormat))
      throw new BadRequest(BAD_REQUEST.TEXT);
    const itemCreateData = {
      customId: "",
      inventory: { connect: { id: inventoryId.toString() } },
      owner: { connect: { id: userId.toString() } },
      values: this._valuesForCreateItem(itemValues),
    };
    return await this.ItemModel.create(
      itemCreateData,
      inventory?.customIdFormat.parts || [],
    );
  }

  async updateItem(id: number, itemData: Partial<IItemData>): Promise<TItem> {
    const itemUpdateData = {
      ...(itemData.customId && { customId: itemData.customId }),
      ...(itemData.values && this._valuesForUpdateItem(itemData.values)),
    };
    return await this.ItemModel.updateById(id, itemUpdateData);
  }

  async deleteItems(ids: number[]): Promise<{ count: number }> {
    return await this.ItemModel.deleteByIds(ids);
  }

  async addLike(userId: string, itemId: number): Promise<TLike> {
    return await this.ItemModel.addLike(userId, itemId);
  }

  async deleteLike(userId: string, itemId: number): Promise<TLike> {
    return await this.ItemModel.deleteLike(userId, itemId);
  }

  async getLikesCount(itemId: number): Promise<number> {
    return await this.ItemModel.countLike(itemId);
  }

  async getLike(userId: string, itemId: number): Promise<TLike | null> {
    return await this.ItemModel.getLike(userId, itemId);
  }
}
