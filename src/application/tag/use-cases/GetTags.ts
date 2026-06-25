import { inject, injectable } from "tsyringe";
import type { ITagRepository } from "../interfaces/ITagRepository.js";
import Tag from "#/domain/value-objects/Tag.js";

@injectable()
export default class GetTags {
  constructor(
    @inject("TagRepository") private readonly tagRepository: ITagRepository,
  ) {}

  public async execute(): Promise<Tag[]> {
    return await this.tagRepository.getAll();
  }
}
