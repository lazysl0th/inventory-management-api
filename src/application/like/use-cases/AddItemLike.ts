import { inject, injectable } from "tsyringe";
import type { IEventBus } from "#/application/realtime/interfaces/IEventBus.js";
import type { ILikeRepository } from "../interfaces/ILikeRepository.js";
import type { TAddItemLikeDto } from "../dtos/LikeDtos.js";
import Like, { type TLikeProps } from "#/domain/value-objects/Like.js";

@injectable()
export default class AddItemLike {
  constructor(
    @inject("LikeRepository")
    private readonly likeRepository: ILikeRepository,
    @inject("EventBus") private readonly eventBus: IEventBus,
  ) {}

  async execute(addLikeDto: TAddItemLikeDto): Promise<Like> {
    const like = new Like(addLikeDto);

    const savedLike = await this.likeRepository.addItemLike(like);

    await this.eventBus.publish<TLikeProps>({
      eventName: "LIKE_ADDED",
      payload: savedLike.toJSON(),
    });

    return savedLike;
  }
}
