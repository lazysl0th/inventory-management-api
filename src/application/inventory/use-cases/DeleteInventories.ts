import { inject, injectable } from "tsyringe";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";
import type { TDeleteInventoriesBodyResponseDto } from "../dtos/InventoryDto.js";

@injectable()
export default class DeleteInventories {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(ids: string[]): Promise<TDeleteInventoriesBodyResponseDto> {
    return await this.inventoryRepository.deleteByIds(ids);
  }
}
