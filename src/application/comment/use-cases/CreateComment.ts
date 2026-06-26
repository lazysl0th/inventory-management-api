import { inject, injectable } from "tsyringe";
import type { ICommentRepository } from "../interfaces/ICommentRepository.js";
import Comment, {
  type TCommentCreateProps,
  type TCommentsProrps,
} from "#/domain/entities/Comment.js";
import type { IEventBus } from "#/application/services/realtime/interfaces/IEventBus.js";

@injectable()
export default class CreateComment {
  constructor(
    @inject("CommentRepository")
    private readonly commentRepository: ICommentRepository,
    @inject("EventBus") private readonly eventBus: IEventBus,
  ) {}

  async execute(createCommentDto: TCommentCreateProps): Promise<Comment> {
    const comment = Comment.create(createCommentDto);

    const savedComment = await this.commentRepository.save(comment);

    await this.eventBus.publish<TCommentsProrps>({
      eventName: "COMMENT_CREATED",
      payload: savedComment.toJSON(),
    });

    return savedComment;
  }
}
