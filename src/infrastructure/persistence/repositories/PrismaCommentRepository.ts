import { container, inject, injectable } from "tsyringe";
import Prisma from "../prisma/prisma.js";
import type { ICommentRepository } from "#/application/comment/interfaces/ICommentRepository.js";
import Comment from "#/domain/entities/Comment.js";
import type { CommentGetPayload } from "../prisma/generated/models.js";

export type TComment = CommentGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

@injectable()
export default class PrismaCommentRepository implements ICommentRepository {
  constructor(@inject(Prisma) private readonly prisma: Prisma) {
    this.prisma = container.resolve(Prisma);
  }

  private createComment(commentData: TComment): Comment {
    return new Comment({
      ...commentData,
      user: { id: commentData.userId, name: commentData.user.name },
    });
  }

  async getAll(inventoryId: number): Promise<Comment[]> {
    const commentsData = await this.prisma.client.comment.findMany({
      where: { inventoryId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return commentsData.map(this.createComment);
  }

  async save(comment: Comment): Promise<void> {
    await this.prisma.client.comment.upsert({
      where: { id: comment.id },
      create: {
        ...comment,
        userId: comment.author.id,
      },
      update: {
        ...comment,
        userId: comment.author.id,
      },
      include: { user: true },
    });
  }
}
