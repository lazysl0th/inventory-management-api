import type { TagGetPayload } from "#/infrastructure/persistence/prisma/generated/models.js";
import type { Settings } from "../settings.js";

export type TTag = TagGetPayload<{ select: Settings["selects"]["tag"] }>;

export type TTagSelect = Settings["selects"]["tag"];

export interface ITagModel {
  tagSelect: TTagSelect;
  getAll(): Promise<TTag[]>;
}
