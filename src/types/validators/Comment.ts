import type { Handler } from "express";

export interface ICommentValidator {
  getComments(): Handler;
  createComment(): Handler;
}
