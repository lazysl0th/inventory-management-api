import { inject, injectable } from "tsyringe";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";
import Inventory, {
  type TCreateInventoryProps,
} from "#/domain/entities/Inventory.js";

@injectable()
export default class CreateInventory {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(inventoryData: TCreateInventoryProps): Promise<Inventory> {
    const inventory = Inventory.create(inventoryData);
    return await this.inventoryRepository.save(inventory);
  }
}
