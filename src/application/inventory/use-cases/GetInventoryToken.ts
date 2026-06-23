import { inject, injectable } from "tsyringe";
import type { TInventory } from "../../../types/models/Inventory.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import { randomBytes } from "node:crypto";
import BadRequestError from "#/domain/errors/BadRequestError.js";
import type { IInventoryRepository } from "../interfaces/IInventoryRepository.js";

@injectable()
export default class GetInventoryToken {
  constructor(
    @inject("InventoryRepository")
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(id: number): Promise<string> {
    const inventory = await this.inventoryRepository.getById(id);
    if (!inventory) throw new NotFoundError("Inventory");
    if (!inventory.token) return await this.createTokenInventory(inventory);
    else return inventory.token;
  }

  async createTokenInventory(inventory: TInventory): Promise<string> {
    const inventoryData = {
      version: inventory.version,
      token: randomBytes(32).toString("hex"),
    };
    const { token } = await this.inventoryRepository.updateById(
      inventory.id,
      inventoryData,
      inventory.version++,
    );
    if (!token) throw new BadRequestError();
    return token;
  }
}
