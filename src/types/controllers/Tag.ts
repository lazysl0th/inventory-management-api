import type { Handler } from "express";

export interface ITagController {
  getTags: Handler;
}
