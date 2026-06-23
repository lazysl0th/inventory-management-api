import { inject, injectable } from "tsyringe";
import type { TInventory } from "../../../types/models/Inventory.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";

@injectable()
export default class GetInventoryById {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(id: number): Promise<TInventory> {
    const inventory = await this.inventoryRepository.getById(id);
    if (!inventory) throw new NotFoundError("Inventory");
    return inventory;
  }
}
