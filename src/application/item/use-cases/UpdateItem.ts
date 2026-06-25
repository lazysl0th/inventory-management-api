import { inject, injectable } from "tsyringe";

import NotFoundError from "#/domain/errors/NotFoundError.js";
import type { IItemRepository } from "../interfaces/IItemRepository.js";
import type { TUpdateItemDto } from "../dtos/ItemDto.js";
import type Item from "#/domain/entities/Item.js";

@injectable()
export default class UpdateItem {
  constructor(
    @inject("ItemRepository")
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(itemData: TUpdateItemDto): Promise<Item> {
    const { itemId } = itemData;
    const item = await this.itemRepository.getById(itemId);
    if (!item) throw new NotFoundError("Item");
    item.update(itemData);
    return await this.itemRepository.save(item);
  }
}
