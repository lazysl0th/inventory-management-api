import type { TTag } from "../models/Tag.js";

export interface ITagService {
  getTags(): Promise<TTag[]>;
}
