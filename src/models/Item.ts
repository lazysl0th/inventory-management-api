import Model from "../base/Model.js";
import type {
  IItemModel,
  TItem,
  TItemCreateData,
  TItemUpdateData,
  TLike,
} from "../types/models/Item.js";
import prisma from "../prisma/prisma.js";
import type IdGeneratorService from "../services/IdGenerator.js";
import type { ICustomIdFormatPart } from "../types/models/Inventory.js";
import { ITEM_SELECT } from "../constants/selects.js";

export default class ItemModel
  extends Model<TItem, TItemCreateData, TItemUpdateData>
  implements IItemModel
{
  constructor(private readonly IdGenerator: IdGeneratorService) {
    super();
  }

  private itemSelect = ITEM_SELECT;

  async getAll(inventoryId: number): Promise<TItem[]> {
    return await prisma.item.findMany({
      where: { inventoryId },
      select: this.itemSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: number): Promise<TItem | null> {
    return await prisma.item.findUnique({
      where: { id },
      select: this.itemSelect,
    });
  }

  async create(
    data: TItemCreateData,
    customIdFormatParts: ICustomIdFormatPart[],
  ): Promise<TItem> {
    return await prisma.$transaction(async (tx) => {
      data.customId = await this.IdGenerator.generateCustomId(
        customIdFormatParts,
        tx,
      );
      return await tx.item.create({
        data,
        select: this.itemSelect,
      });
    });
  }

  async updateById(id: number, data: TItemUpdateData): Promise<TItem> {
    return prisma.item.update({
      where: { id },
      data,
      select: this.itemSelect,
    });
  }

  async deleteByIds(ids: number[]): Promise<{ count: number }> {
    return await prisma.item.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async getLike(userId: number, itemId: number): Promise<TLike | null> {
    return prisma.like.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
  }

  async addLike(userId: number, itemId: number): Promise<TLike> {
    return await prisma.like.create({
      data: { userId, itemId },
    });
  }

  async deleteLike(userId: number, itemId: number): Promise<TLike> {
    return prisma.like.delete({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });
  }

  async countLike(itemId: number): Promise<number> {
    return prisma.like.count({
      where: { itemId },
    });
  }
}

/*
export const selectLastItem = async (inventoryId, client) => {
    return await client.item.findFirst({
        where: { inventoryId: inventoryId },
        orderBy: { id: 'desc' },
        select: { id: true, customId: true }
    });
}

export const itemsCount = (inventoryId, client) => {
    return client.item.count({
        where: { inventoryId },
    });
}
*/
