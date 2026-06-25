import type { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";
import HttpStatusCode from "../../constants/httpStatusCode.js";
import GetTags from "#/application/tag/use-cases/GetTags.js";
import type Tag from "#/domain/value-objects/Tag.js";

@injectable()
export default class TagController {
  constructor(@inject(GetTags) private readonly getAll: GetTags) {}

  public getTags: RequestHandler<never, Tag[]> = async (
    _,
    res,
  ): Promise<void> => {
    const tags = await this.getAll.execute();
    res.status(HttpStatusCode.Ok).json(tags);
  };
}
