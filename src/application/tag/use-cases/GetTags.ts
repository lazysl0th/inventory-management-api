import { inject, injectable } from "tsyringe";
import type { ITagRepository } from "../interfaces/ITagRepository.js";
import type Tag from "#/domain/entities/Tag.js";

@injectable()
export default class GetTags {
  constructor(
    @inject("ITagRepository") private readonly tagRepository: ITagRepository,
  ) {}

  public async execute(): Promise<Tag[]> {
    return await this.tagRepository.getAll();
  }
}
