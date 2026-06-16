import Model from "../base/Model.js";
import type {
  IInventoryModel,
  TInventory,
  TInventoryCreateData,
  TInventoryUpdateData,
} from "../types/models/Inventory.js";
import prisma from "../prisma/prisma.js";
import type { EnumInventorySortOrder } from "../types/services/Inventory.js";
import { INVENTORY_SELECT } from "../constants/selects.js";
import { INVENTORY_ORDER } from "../constants/orders.js";

export default class InventoryModel
  extends Model<TInventory, TInventoryCreateData, TInventoryUpdateData>
  implements IInventoryModel
{
  private inventorySelect = INVENTORY_SELECT;

  private inventorySortOrder = INVENTORY_ORDER;

  async getById(id: number): Promise<TInventory | null> {
    return await prisma.inventory.findUnique({
      where: { id },
      select: this.inventorySelect,
    });
  }

  async getByToken(token: string): Promise<TInventory | null> {
    return await prisma.inventory.findUnique({
      where: { token },
      select: this.inventorySelect,
    });
  }

  async getAll(
    sortOrder?: EnumInventorySortOrder,
    ownerId?: number,
    allowedUserId?: number,
    isPublic?: boolean,
  ): Promise<TInventory[]> {
    return await prisma.inventory.findMany({
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
    return await prisma.inventory.create({
      data,
      select: this.inventorySelect,
    });
  }

  async updateById(
    id: number,
    data: TInventoryUpdateData,
    version: number,
  ): Promise<TInventory> {
    return await prisma.inventory.update({
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
    return await prisma.inventory.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async search(query: string): Promise<TInventory[]> {
    return await prisma.inventory.findMany({
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
