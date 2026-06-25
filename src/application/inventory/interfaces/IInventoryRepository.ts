import type {
  TDeleteInventoriesBodyResponseDto,
  TGetInventoriesQueryDto,
} from "../dtos/InventoryDto.js";
import type Inventory from "#/domain/entities/Inventory.js";

export interface IInventoryRepository {
  getAll({
    sort,
    ownerId,
    allowedUserId,
    isPublic,
  }: TGetInventoriesQueryDto): Promise<Inventory[]>;
  search(searchQuery: string): Promise<Inventory[]>;
  getById(id: string): Promise<Inventory | null>;
  getByToken(token: string): Promise<Inventory | null>;
  save(inventory: Inventory): Promise<Inventory>;
  deleteByIds(ids: string[]): Promise<TDeleteInventoriesBodyResponseDto>;
}
