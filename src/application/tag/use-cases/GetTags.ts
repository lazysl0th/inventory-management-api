import { inject, injectable } from "tsyringe";
import type { ITagRepository } from "../interfaces/ITagRepository.js";
import type { TTag } from "#/domain/entities/Tag.js";

@injectable()
export default class GetTags {
  constructor(
    @inject("ITagRepository") private readonly TagRepository: ITagRepository,
  ) {}

  public async execute(): Promise<TTag[]> {
    return await this.TagRepository.getAll();
  }
}
