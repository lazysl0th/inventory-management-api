import Model from "../base/Model.js";
import type {
  IInventoryModel,
  TInventory,
  TInventoryCreateData,
  TInventoryUpdateData,
} from "../types/models/Inventory.js";
import Prisma from "../infrastructure/persistence/prisma/prisma.js";
import type { EnumInventorySortOrder } from "../types/services/Inventory.js";
import { INVENTORY_SELECT } from "../constants/selects.js";
import { INVENTORY_ORDER } from "../constants/orders.js";
import { container, injectable } from "tsyringe";
@injectable()
export default class InventoryModel
  extends Model<TInventory, TInventoryCreateData, TInventoryUpdateData>
  implements IInventoryModel
{
  private inventorySelect = INVENTORY_SELECT;

  private inventorySortOrder = INVENTORY_ORDER;
  prisma: Prisma;

  constructor(/*@inject(Prisma) private readonly prisma: Prisma*/) {
    super();
    this.prisma = container.resolve(Prisma);
  }

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
