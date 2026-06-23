import { inject, injectable } from "tsyringe";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";

@injectable()
export default class DeleteInventories {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(ids: number[]): Promise<{ count: number }> {
    return await this.inventoryRepository.deleteByIds(ids);
  }
}
