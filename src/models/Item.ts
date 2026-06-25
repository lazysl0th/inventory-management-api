import Model from "../base/Model.js";
import type {
  IItemModel,
  TItem,
  TItemCreateData,
  TItemUpdateData,
  TLike,
} from "../types/models/Item.js";
import Prisma from "../infrastructure/persistence/prisma/prisma.js";
import type IdGeneratorService from "../services/IdGenerator.js";
import { ITEM_SELECT } from "../constants/selects.js";
import { container } from "tsyringe";
import type CustomIdFormatPart from "#/domain/value-objects/CustomIdFormatPart.js";

export default class ItemModel
  extends Model<TItem, TItemCreateData, TItemUpdateData>
  implements IItemModel
{
  prisma: Prisma;
  constructor(
    /*@inject(Prisma) private readonly prisma: Prisma,*/
    private readonly IdGenerator: IdGeneratorService,
  ) {
    super();
    this.prisma = container.resolve(Prisma);
  }

  private itemSelect = ITEM_SELECT;

  async getAll(inventoryId: number): Promise<TItem[]> {
    return await this.prisma.client.item.findMany({
      where: { inventoryId: inventoryId.toString() },
      select: this.itemSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: number): Promise<TItem | null> {
    return await this.prisma.client.item.findUnique({
      where: { id },
      select: this.itemSelect,
    });
  }

  async create(
    data: TItemCreateData,
    customIdFormatParts: CustomIdFormatPart[],
  ): Promise<TItem> {
    return await this.prisma.client.$transaction(async (tx) => {
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
    return this.prisma.client.item.update({
      where: { id },
      data,
      select: this.itemSelect,
    });
  }

  async deleteByIds(ids: number[]): Promise<{ count: number }> {
    return await this.prisma.client.item.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async getLike(userId: string, itemId: number): Promise<TLike | null> {
    return this.prisma.client.like.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
  }

  async addLike(userId: string, itemId: number): Promise<TLike> {
    return await this.prisma.client.like.create({
      data: { userId, itemId },
    });
  }

  async deleteLike(userId: string, itemId: number): Promise<TLike> {
    return this.prisma.client.like.delete({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });
  }

  async countLike(itemId: number): Promise<number> {
    return this.prisma.client.like.count({
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
