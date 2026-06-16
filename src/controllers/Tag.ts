import { Controller } from "../base/Controller.js";
import type { Handler } from "express";
import type { ITagController } from "../types/controllers/Tag.js";
import type { ITagService } from "../types/services/Tag.js";
import type { TTag } from "../types/models/Tag.js";

export default class TagController
  extends Controller
  implements ITagController
{
  constructor(private readonly TagService: ITagService) {
    super();
  }

  getTags: Handler = this.handle(async (req, res) => {
    const tags = await this.TagService.getTags();
    this.ok<TTag[]>(res, tags);
  });
}
