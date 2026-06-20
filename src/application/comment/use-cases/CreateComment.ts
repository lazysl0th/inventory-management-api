import { inject, injectable } from "tsyringe";
import type { ICommentRepository } from "../interfaces/ICommentRepository.js";
import type { TCreateCommentDto } from "../dtos/CommentDto.js";
import type { IEventBus } from "#/application/realtime/interfaces/IEventBus.js";
import type Comment from "#/domain/entities/Comment.js";
import type { ICommentProps } from "#/domain/entities/Comment.js";

@injectable()
export default class CreateComment {
  constructor(
    @inject("ICommentRepository")
    private readonly commentRepository: ICommentRepository,
    @inject("IEventBus") private readonly eventBus: IEventBus,
  ) {}

  async execute(createCommentDto: TCreateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.create(createCommentDto);

    await this.eventBus.publish<ICommentProps>({
      eventName: "COMMENT_CREATED",
      payload: comment.toJSON(),
    });

    return comment;
  }
}
