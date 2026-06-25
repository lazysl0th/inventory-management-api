import { inject, injectable } from "tsyringe";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import type Inventory from "#/domain/entities/Inventory.js";
import type { TUpdateInventoryProps } from "#/domain/entities/Inventory.js";

@injectable()
export default class UpdateInventory {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(inventoryData: TUpdateInventoryProps): Promise<Inventory> {
    const { id } = inventoryData;
    const inventory = await this.inventoryRepository.getById(id);
    if (!inventory) throw new NotFoundError("Inventory");
    inventory.update(inventoryData);
    return await this.inventoryRepository.save(inventory);
  }
}
