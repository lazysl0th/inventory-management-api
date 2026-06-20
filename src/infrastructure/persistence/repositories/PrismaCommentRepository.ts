import { container, inject, injectable } from "tsyringe";
import Prisma from "../prisma/prisma.js";
import type {
  ICommentRepository,
  TComment,
} from "#/application/comment/interfaces/ICommentRepository.js";
import Comment from "#/domain/entities/Comment.js";
import type { TCreateCommentDto } from "#/application/comment/dtos/CommentDto.js";

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
            name: true,
          },
        },
      },
    });
    return commentsData.map(this.createComment);
  }

  async create(commentData: TCreateCommentDto): Promise<Comment> {
    const newCommentData = await this.prisma.client.comment.create({
      data: commentData,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return this.createComment(newCommentData);
  }
}
