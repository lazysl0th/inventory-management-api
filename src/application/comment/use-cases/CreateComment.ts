import { inject, injectable } from "tsyringe";
import type { ICommentRepository } from "../interfaces/ICommentRepository.js";
import type { TCreateCommentDto } from "../dtos/CommentDto.js";
import type { IEventBus } from "#/application/realtime/interfaces/IEventBus.js";
import Comment from "#/domain/entities/Comment.js";
import type { ICommentProps } from "#/domain/entities/Comment.js";

@injectable()
export default class CreateComment {
  constructor(
    @inject("CommentRepository")
    private readonly commentRepository: ICommentRepository,
    @inject("EventBus") private readonly eventBus: IEventBus,
  ) {}

  async execute(createCommentDto: TCreateCommentDto): Promise<Comment> {
    const comment = Comment.create(createCommentDto);

    await this.commentRepository.save(comment);

    await this.eventBus.publish<ICommentProps>({
      eventName: "COMMENT_CREATED",
      payload: comment.toJSON(),
    });

    return comment;
  }
}
