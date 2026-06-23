import { inject, injectable } from "tsyringe";
import type {
  IInventoryRepository,
  TInventory,
  TInventoryCreateData,
  TInventoryUpdateData,
} from "#/application/inventory/interfaces/IInventoryRepository.js";
import { INVENTORY_SELECT } from "../../../constants/selects.js";
import { INVENTORY_ORDER } from "../../../constants/orders.js";
import Prisma from "../prisma/prisma.js";
import type { EnumInventorySortOrder } from "../../../types/services/Inventory.js";
@injectable()
export default class PrismaInventoryRepository implements IInventoryRepository {
  private inventorySelect = INVENTORY_SELECT;

  private inventorySortOrder = INVENTORY_ORDER;

  constructor(@inject(Prisma) private readonly prisma: Prisma) {}

  async getById(id: number): Promise<TInventory | null> {
    return await this.prisma.client.inventory.findUnique({
      where: { id },
      select: this.inventorySelect,
    });
  }

  async getByToken(token: string): Promise<TInventory | null> {
    return await this.prisma.client.inventory.findUnique({
      where: { token },
      select: this.inventorySelect,
    });
  }

  async getAll(
    sortOrder?: EnumInventorySortOrder,
    ownerId?: string,
    allowedUserId?: string,
    isPublic?: boolean,
  ): Promise<TInventory[]> {
    return await this.prisma.client.inventory.findMany({
      ...(ownerId && { where: { ownerId } }),
      ...(allowedUserId &&
        isPublic && {
          where: {
            OR: [
              { allowedUsers: { some: { id: allowedUserId } } },
              { isPublic },
            ],
          },
        }),
      select: this.inventorySelect,
      ...(sortOrder && { orderBy: this.inventorySortOrder[sortOrder] }),
    });
  }

  async create(data: TInventoryCreateData): Promise<TInventory> {
    return await this.prisma.client.inventory.create({
      data,
      select: this.inventorySelect,
    });
  }

  async updateById(
    id: number,
    data: TInventoryUpdateData,
    version: number,
  ): Promise<TInventory> {
    return await this.prisma.client.inventory.update({
      where: {
        id_version: {
          id,
          version: version,
        },
      },
      data,
      select: this.inventorySelect,
    });
  }

  async deleteByIds(ids: number[]): Promise<{ count: number }> {
    return await this.prisma.client.inventory.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async search(query: string): Promise<TInventory[]> {
    return await this.prisma.client.inventory.findMany({
      where: {
        OR: [
          {
            title: {
              search: query,
            },
            description: {
              search: query,
            },
          },
        ],
      },
      orderBy: {
        _relevance: {
          fields: ["title", "description"],
          search: query,
          sort: "asc",
        },
      },
      select: this.inventorySelect,
    });
  }
}

/*
export const selectInventoryByApiToken = (apiToken, client) => {
    return client.inventory.findUnique({
        where: { apiToken: apiToken },
        include: {
            owner: { select: { id: true, name: true, email: true } },
            items: true,
            tags: true,
            fields: true,
            allowedUsers: { select: { id: true, name: true, email: true } },
            _count: { select: { items: true } },
        },
        
    });
}*/
