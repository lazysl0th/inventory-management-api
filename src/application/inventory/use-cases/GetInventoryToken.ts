import { inject, injectable } from "tsyringe";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";
import type { TTokenGenerateService } from "#/application/services/token/interfaces/ITokenService.js";

@injectable()
export default class GetInventoryToken {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
    @inject("TokenService")
    private readonly tokenGenerateService: TTokenGenerateService,
  ) {}

  async execute(inventoryId: string): Promise<string> {
    const inventory = await this.inventoryRepository.getById(inventoryId);
    if (!inventory) throw new NotFoundError("Inventory");
    if (!inventory.token) {
      const token = this.tokenGenerateService.generate(inventoryId);
      inventory.update({ id: inventoryId, token: token });
      await this.inventoryRepository.save(inventory);
      return token;
    }
    return inventory.token;
  }
}
