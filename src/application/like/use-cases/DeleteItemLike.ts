import { inject, injectable } from "tsyringe";
import type { IEventBus } from "#/application/realtime/interfaces/IEventBus.js";
import type { ILikeRepository } from "../interfaces/ILikeRepository.js";
import type { TDeleteItemLikeDto } from "../dtos/LikeDtos.js";
import Like, { type TLikeProps } from "#/domain/value-objects/Like.js";

@injectable()
export default class DeleteItemLike {
  constructor(
    @inject("LikeRepository")
    private readonly likeRepository: ILikeRepository,
    @inject("EventBus") private readonly eventBus: IEventBus,
  ) {}

  async execute(deleteLikeDto: TDeleteItemLikeDto): Promise<Like> {
    const like = new Like(deleteLikeDto);

    const savedLike = await this.likeRepository.deleteItemLike(like);

    await this.eventBus.publish<TLikeProps>({
      eventName: "LIKE_DELETED",
      payload: savedLike.toJSON(),
    });

    return savedLike;
  }
}
