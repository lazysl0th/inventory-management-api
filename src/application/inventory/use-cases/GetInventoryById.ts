import { inject, injectable } from "tsyringe";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";
import type Inventory from "#/domain/entities/Inventory.js";

@injectable()
export default class GetInventoryById {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.getById(id);
    if (!inventory) throw new NotFoundError("Inventory");
    return inventory;
  }
}
