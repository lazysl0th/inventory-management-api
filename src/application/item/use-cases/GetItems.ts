import { inject, injectable } from "tsyringe";
import type { IItemRepository } from "../interfaces/IItemRepository.js";
import type Item from "#/domain/entities/Item.js";
import type { IInventoryRepository } from "#/application/inventory/interfaces/IInventoryRepository.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";

@injectable()
export default class GetItems {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
    @inject("ItemRepository")
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(inventoryId: string): Promise<Item[]> {
    const inventory = await this.inventoryRepository.getById(inventoryId);
    if (!inventory) throw new NotFoundError("Inventory");
    return await this.itemRepository.getAll(inventoryId);
  }
}
