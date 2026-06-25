import { inject, injectable } from "tsyringe";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import type Item from "#/domain/entities/Item.js";
import type { IItemRepository } from "../interfaces/IItemRepository.js";

@injectable()
export default class GetItem {
  constructor(
    @inject("ItemRepository")
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(id: string): Promise<Item> {
    const item = await this.itemRepository.getById(id);
    if (!item) throw new NotFoundError("Item");
    return item;
  }
}
