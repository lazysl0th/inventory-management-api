import { inject, injectable } from "tsyringe";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";
import type { TGetInventoriesQueryDto } from "../dtos/InventoryDto.js";
import type Inventory from "#/domain/entities/Inventory.js";

@injectable()
export default class GetInventories {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute({
    sort,
    ownerId,
    allowedUserId,
    isPublic,
  }: TGetInventoriesQueryDto): Promise<Inventory[]> {
    return await this.inventoryRepository.getAll({
      sort,
      ownerId,
      allowedUserId,
      isPublic,
    });
  }
}
