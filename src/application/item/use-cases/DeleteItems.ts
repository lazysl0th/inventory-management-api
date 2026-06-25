import { inject, injectable } from "tsyringe";

import type { IItemRepository } from "../interfaces/IItemRepository.js";
import type { TDeleteItemsBodyResponseDto } from "../dtos/ItemDto.js";

@injectable()
export default class DeleteItems {
  constructor(
    @inject("ItemRepository")
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(ids: string[]): Promise<TDeleteItemsBodyResponseDto> {
    return await this.itemRepository.deleteByIds(ids);
  }
}
