import { inject, injectable } from "tsyringe";
import type { ICommentRepository } from "../interfaces/ICommentRepository.js";
import type Comment from "#/domain/entities/Comment.js";

@injectable()
export default class GetComments {
  constructor(
    @inject("ICommentRepository")
    private readonly commentsRepository: ICommentRepository,
  ) {}

  async execute(inventoryId: number): Promise<Comment[]> {
    return await this.commentsRepository.getAll(inventoryId);
  }
}
