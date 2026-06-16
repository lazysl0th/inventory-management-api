import type { ITagModel, TTag } from "../types/models/Tag.js";
import type { ITagService } from "../types/services/Tag.js";

export default class TagService implements ITagService {
  constructor(private readonly TagModel: ITagModel) {}

  async getTags(): Promise<TTag[]> {
    return await this.TagModel.getAll();
  }
}
