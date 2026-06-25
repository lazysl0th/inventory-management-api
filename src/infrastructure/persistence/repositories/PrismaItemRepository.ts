import { inject, injectable } from "tsyringe";
import type { IItemRepository } from "#/application/item/interfaces/IItemRepository.js";
import Prisma from "../prisma/prisma.js";
import type { ItemGetPayload } from "../prisma/generated/models.js";
import Item from "#/domain/entities/Item.js";
import type { TDeleteItemsBodyResponseDto } from "#/application/item/dtos/ItemDto.js";

type TPrismaItem = ItemGetPayload<{
  include: {
    values: {
      include: {
        field: true;
      };
    };
    owner: true;
  };
}>;

@injectable()
export default class PrismaItemRepository implements IItemRepository {
  private include = {
    values: {
      include: {
        field: true,
      },
    },
    owner: true,
  };
  constructor(@inject(Prisma) private readonly prisma: Prisma) {}

  private createItem(itemData: TPrismaItem) {
    return Item.restore({ ...itemData, inventory: itemData.inventoryId });
  }

  async getAll(inventoryId: string): Promise<Item[]> {
    const itemsData = await this.prisma.client.item.findMany({
      where: { inventoryId: inventoryId },
      orderBy: { createdAt: "desc" },
      include: this.include,
    });
    return itemsData.map(this.createItem);
  }

  async getById(id: string): Promise<Item | null> {
    const itemData = await this.prisma.client.item.findUnique({
      where: { id },
      include: this.include,
    });
    return itemData ? this.createItem(itemData) : null;
  }

  async deleteByIds(ids: string[]): Promise<TDeleteItemsBodyResponseDto> {
    return await this.prisma.client.item.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async save(item: Item): Promise<Item> {
    const { id, ...data } = item.toPersistence();
    const itemData = await this.prisma.client.item.upsert({
      where: { id },
      create: {
        ...data,
        id,
        owner: {
          connect: { id: data.owner },
        },
        values: {
          connectOrCreate: data.values.map((value) => ({
            where: { id: value.id },
            create: { ...value, field: { connect: { id: value.field } } },
          })),
        },
        inventory: {
          connect: { id: data.inventory },
        },
      },
      update: {
        ...data,
        owner: {
          connect: { id: data.owner },
        },
        values: {
          connectOrCreate: data.values.map((value) => ({
            where: { id: value.id },
            create: { ...value, field: { connect: { id: value.field } } },
          })),
        },
        inventory: {
          connect: { id: data.inventory },
        },
      },
      include: this.include,
    });
    return this.createItem(itemData);
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
}
