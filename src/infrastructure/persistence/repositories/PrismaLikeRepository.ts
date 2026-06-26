import { inject, injectable } from "tsyringe";
import type { ILikeRepository } from "#/application/like/interfaces/ILikeRepository.js";
import Prisma from "../prisma/prisma.js";
import Like from "#/domain/value-objects/Like.js";

@injectable()
export default class PrismaLikeRepository implements ILikeRepository {
  constructor(@inject(Prisma) private readonly prisma: Prisma) {}

  async addItemLike({ userId, itemId }: Like): Promise<Like> {
    const likeData = await this.prisma.client.like.create({
      data: { userId, itemId },
    });
    return new Like(likeData);
  }

  async deleteItemLike({ userId, itemId }: Like): Promise<Like> {
    const likeData = await this.prisma.client.like.delete({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });
    return new Like(likeData);
  }

  /*async getLike(userId: string, itemId: number): Promise<TLike | null> {
    return this.prisma.client.like.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
  }*/
}
