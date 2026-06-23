import { inject, injectable } from "tsyringe";
import type { EnumInventorySortOrder } from "../../../types/services/Inventory.js";
import type { TInventory } from "../../../types/models/Inventory.js";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";

@injectable()
export default class GetInventories {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(
    sortOrder?: EnumInventorySortOrder,
    ownerId?: string,
    allowedUserId?: string,
    isPublic?: boolean,
  ): Promise<TInventory[]> {
    return await this.inventoryRepository.getAll(
      sortOrder,
      ownerId,
      allowedUserId,
      isPublic,
    );
  }
}
