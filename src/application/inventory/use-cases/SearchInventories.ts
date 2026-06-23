import { inject, injectable } from "tsyringe";
import type { TInventory } from "../../../types/models/Inventory.js";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";

@injectable()
export default class SearchInventories {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(query: string): Promise<TInventory[]> {
    const words = query
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length === 0) return [];
    const formattedQuery = words.map((word) => `${word}:*`).join(" & ");
    return await this.inventoryRepository.search(formattedQuery);
  }
}
