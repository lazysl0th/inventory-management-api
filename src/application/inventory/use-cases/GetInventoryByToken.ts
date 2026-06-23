import { inject, injectable } from "tsyringe";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";

@injectable()
export default class GetInventoryByToken {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(token: string): Promise<void> {
    const inventory = await this.inventoryRepository.getByToken(token);
    if (!inventory) throw new NotFoundError("Inventory");
    //const stats = await getStats(inventory, prisma);
    //return {inventory: { title: inventory.title, fields: inventory.fields, itemsCount: inventory._count.items}, stats: stats};
  }
}
