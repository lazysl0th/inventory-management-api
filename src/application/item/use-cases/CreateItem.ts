import { inject, injectable } from "tsyringe";
import type { IItemRepository } from "../interfaces/IItemRepository.js";
import Item from "#/domain/entities/Item.js";
import type { IInventoryRepository } from "#/application/inventory/interfaces/IInventoryRepository.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import type { TCreateItemDto } from "../dtos/ItemDto.js";
import type { ICustomIdService } from "#/application/services/CustomId/interfaces/ICustomIdService.js";

@injectable()
export default class CreateItem {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
    @inject("ItemRepository")
    private readonly itemRepository: IItemRepository,
    @inject("CustomIdService")
    private readonly customIdService: ICustomIdService,
  ) {}

  async execute(itemData: TCreateItemDto): Promise<Item> {
    const inventory = await this.inventoryRepository.getById(
      itemData.inventoryId,
    );
    if (!inventory) throw new NotFoundError("Inventory");
    const customId = await this.customIdService.generate(
      inventory.customIdFormat.parts,
    );
    const item = Item.create({
      ...itemData,
      customId,
      inventory: itemData.inventoryId,
    });
    return await this.itemRepository.save(item);
  }
}
