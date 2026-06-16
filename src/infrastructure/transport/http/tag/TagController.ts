import type { RequestHandler } from "express";
import { injectable } from "tsyringe";
import HttpStatusCode from "../constants/httpStatusCode.js";
import type { TTag } from "#/domain/entities/Tag.js";
import type { ITagService } from "../../../../types/services/Tag.js";

@injectable()
export default class TagController {
  constructor(private readonly TagService: ITagService) {}

  public getTags: RequestHandler<never, TTag[]> = async (
    _,
    res,
  ): Promise<void> => {
    const tags = await this.TagService.getTags();
    res.status(HttpStatusCode.Ok).json(tags);
  };
}
