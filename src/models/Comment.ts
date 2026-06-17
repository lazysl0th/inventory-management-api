import { container, inject } from "tsyringe";
import { COMMENT_SELECT } from "../constants/selects.js";
import type { ICommentModel, TComment } from "../types/models/Comment.js";
import Prisma from "../infrastructure/persistence/prisma/prisma.js";

export default class CommentModel implements ICommentModel {
  commentSelect = COMMENT_SELECT;

  constructor(@inject(Prisma) private readonly prisma: Prisma) {
    this.prisma = container.resolve(Prisma);
  }

  async getAll(inventoryId: number): Promise<TComment[]> {
    return await this.prisma.client.comment.findMany({
      where: { inventoryId },
      select: this.commentSelect,
    });
  }

  async create(
    content: string,
    inventoryId: number,
    userId: number,
  ): Promise<TComment> {
    return await this.prisma.client.comment.create({
      data: { content, inventoryId, userId },
      select: this.commentSelect,
    });
  }
}
