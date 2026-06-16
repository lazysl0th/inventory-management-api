import { inject, injectable } from "tsyringe";
import type { ITagModel, TTag } from "../../../types/models/Tag.js";

@injectable()
export default class GetTags {
  constructor(
    @inject("ITagRepository") private readonly TagRepository: ITagModel,
  ) {}

  public async execute(): Promise<TTag[]> {
    return await this.TagRepository.getAll();
  }
}
