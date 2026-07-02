import { inject, injectable } from "tsyringe";
import type { IInventoryRepository } from "#/application/inventory/interfaces/IInventoryRepository.js";
import Prisma from "../prisma/prisma.js";
import type {
  TDeleteInventoriesBodyResponseDto,
  TGetInventoriesQueryDto,
} from "#/application/inventory/dtos/InventoryDto.js";
import type { InventoryGetPayload } from "../prisma/generated/models.js";
import Inventory from "#/domain/entities/Inventory.js";
import CustomIdFormat from "#/domain/value-objects/CustomIdFormat.js";

type TInventory = InventoryGetPayload<{
  include: {
    owner: true;
    allowedUsers: true;
    tags: { select: { name: true } };
    fields: true;
  };
}>;

@injectable()
export default class PrismaInventoryRepository implements IInventoryRepository {
  private inventorySortOrder = {
    latest: { createdAt: "desc" },
    topItems: { items: { _count: "desc" } },
  } as const;

  private include = {
    owner: true,
    allowedUsers: true,
    tags: true,
    fields: true,
  };

  constructor(@inject(Prisma) private readonly prisma: Prisma) {}

  private createInventory(inventoryData: TInventory): Inventory {
    return Inventory.restore({
      ...inventoryData,
      customIdFormat: CustomIdFormat.restore(inventoryData.customIdFormat),
    });
  }

  async getAll({
    sort,
    ownerId,
    allowedUserId,
    isPublic,
  }: TGetInventoriesQueryDto): Promise<Inventory[]> {
    const inventoriesData = await this.prisma.client.inventory.findMany({
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
      ...(sort && { orderBy: this.inventorySortOrder[sort] }),
      include: this.include,
    });
    return inventoriesData.map(this.createInventory);
  }

  async search(searchQuery: string): Promise<Inventory[]> {
    const inventoriesData = await this.prisma.client.inventory.findMany({
      where: {
        OR: [
          {
            title: {
              search: searchQuery,
            },
            description: {
              search: searchQuery,
            },
          },
        ],
      },
      orderBy: {
        _relevance: {
          fields: ["title", "description"],
          search: searchQuery,
          sort: "asc",
        },
      },
      include: this.include,
    });
    return inventoriesData.map(this.createInventory);
  }

  async getById(id: string): Promise<Inventory | null> {
    const inventoryData = await this.prisma.client.inventory.findUnique({
      where: { id },
      include: this.include,
    });
    return inventoryData ? this.createInventory(inventoryData) : null;
  }

  async getByToken(token: string): Promise<Inventory | null> {
    const inventoryData = await this.prisma.client.inventory.findUnique({
      where: { token },
      include: this.include,
    });
    return inventoryData ? this.createInventory(inventoryData) : null;
  }

  async save(inventory: Inventory): Promise<Inventory> {
    const { id, ...data } = inventory.toPersistence();
    const inventoryData = await this.prisma.client.inventory.upsert({
      where: { id },
      create: {
        ...data,
        id,
        owner: {
          connect: { id: data.owner },
        },
        allowedUsers: {
          connect: data.allowedUsers.map((user) => ({
            id: user.id,
          })),
        },
        tags: {
          connectOrCreate: data.tags.map((tag) => ({
            where: { name: tag.name },
            create: { name: tag.name },
          })),
        },
        fields: {
          connectOrCreate: data.fields.map((field) => ({
            where: { id: field.id },
            create: { ...field },
          })),
        },
      },
      update: {
        ...data,
        owner: {
          connect: { id: data.owner },
        },
        allowedUsers: {
          connect: data.allowedUsers.map((user) => ({
            id: user.id,
          })),
        },
        tags: {
          set: [],
          connectOrCreate: data.tags.map((tag) => ({
            where: { name: tag.name },
            create: { name: tag.name },
          })),
        },
        fields: {
          connectOrCreate: data.fields.map((field) => ({
            where: { id: field.id },
            create: { ...field },
          })),
        },
      },
      include: this.include,
    });
    return this.createInventory(inventoryData);
  }

  async deleteByIds(ids: string[]): Promise<TDeleteInventoriesBodyResponseDto> {
    return await this.prisma.client.inventory.deleteMany({
      where: { id: { in: ids } },
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
