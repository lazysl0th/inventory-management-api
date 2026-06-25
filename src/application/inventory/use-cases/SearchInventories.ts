import { inject, injectable } from "tsyringe";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";
import type { TSearchInventoriesQueryDto } from "../dtos/InventoryDto.js";
import type Inventory from "#/domain/entities/Inventory.js";

@injectable()
export default class SearchInventories {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute({
    searchQuery,
  }: TSearchInventoriesQueryDto): Promise<Inventory[]> {
    if (searchQuery.length === 0) return [];
    const formattedSearchQuery = searchQuery
      .map((word) => `${word}:*`)
      .join(" & ");
    return await this.inventoryRepository.search(formattedSearchQuery);
  }
}
