import { inject, injectable } from "tsyringe";
import Prisma from "../prisma/prisma.js";
import type { ICommentRepository } from "#/application/comment/interfaces/ICommentRepository.js";
import Comment from "#/domain/entities/Comment.js";
import type { CommentGetPayload } from "../prisma/generated/models.js";

export type TComment = CommentGetPayload<{
  include: {
    user: true;
  };
}>;

@injectable()
export default class PrismaCommentRepository implements ICommentRepository {
  constructor(@inject(Prisma) private readonly prisma: Prisma) {}

  private createComment(commentData: TComment): Comment {
    return Comment.restore(commentData);
  }

  async getAll(inventoryId: string): Promise<Comment[]> {
    const commentsData = await this.prisma.client.comment.findMany({
      where: { inventoryId },
      include: {
        user: true,
      },
    });
    return commentsData.map(this.createComment);
  }

  async save(comment: Comment): Promise<Comment> {
    const commentProps = comment.toPersistence();
    const commentData = await this.prisma.client.comment.upsert({
      where: { id: commentProps.id },
      create: {
        ...commentProps,
        user: {
          connect: { id: commentProps.user },
        },
        inventory: {
          connect: { id: commentProps.inventory },
        },
      },
      update: {
        ...commentProps,
        user: {
          connect: { id: commentProps.user },
        },
        inventory: {
          connect: { id: commentProps.inventory },
        },
      },
      include: { user: true },
    });
    return this.createComment(commentData);
  }
}
